'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Campaign } from '@/lib/types'
import { getCampaign, saveCampaign, deleteCampaign as removeFromStore, slugExists } from '@/lib/store'
import { buildBriefFromInput } from '@/lib/engine/brief'
import { createCampaignFromBrief, generateCampaign, defaultDeployment, defaultTracking, baseUrl } from '@/lib/engine/generate'
import { generateGoogleAdsReadiness } from '@/lib/engine/google-ads'
import { runQa } from '@/lib/engine/qa'
import { computeBlockers, hasRedBlockers } from '@/lib/engine/blockers'
import { uniqueSlug } from '@/lib/slug'
import { addVersion } from '@/lib/versioning'

function refreshDerived(campaign: Campaign): Campaign {
  campaign.googleAds = generateGoogleAdsReadiness(campaign, baseUrl())
  campaign.qa = runQa(campaign)
  campaign.blockers = computeBlockers(campaign)
  campaign.updatedAt = new Date().toISOString()
  return campaign
}

function requireCampaign(id: string): Campaign {
  const campaign = getCampaign(id)
  if (!campaign) throw new Error(`Campaign ${id} not found`)
  return campaign
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createCampaignAction(formData: FormData): Promise<void> {
  const brief = buildBriefFromInput({
    freeText: str(formData, 'freeText'),
    name: str(formData, 'name'),
    service: str(formData, 'service'),
    audience: str(formData, 'audience'),
    industry: str(formData, 'industry'),
    geography: str(formData, 'geography'),
    objective: str(formData, 'objective'),
    primaryIntent: str(formData, 'primaryIntent'),
    primaryCTA: str(formData, 'primaryCTA'),
    offer: str(formData, 'offer'),
    existingKeywords: str(formData, 'existingKeywords'),
    competitorUrls: str(formData, 'competitorUrls'),
    additionalInstructions: str(formData, 'additionalInstructions'),
  })

  let campaign = createCampaignFromBrief(brief)
  campaign = generateCampaign(campaign)
  campaign = addVersion(campaign, 'Initial generation', 'AI generation engine')
  saveCampaign(campaign)

  revalidatePath('/studio')
  revalidatePath('/studio/campaigns')
  redirect(`/studio/campaigns/${campaign.slug}`)
}

function str(formData: FormData, key: string): string | undefined {
  const v = formData.get(key)
  return typeof v === 'string' && v.trim() ? v : undefined
}

// ---------------------------------------------------------------------------
// Read-through mutations
// ---------------------------------------------------------------------------

export async function regenerateLandingPage(id: string) {
  let campaign = requireCampaign(id)
  campaign = generateCampaign(campaign)
  campaign = addVersion(campaign, 'Regenerated landing page', 'AI generation engine')
  saveCampaign(campaign)
  revalidatePath(`/studio/campaigns/${campaign.slug}`)
  revalidatePath(`/campaigns/${campaign.slug}`)
}

export async function runResearchAction(id: string) {
  const campaign = requireCampaign(id)
  const { runResearch } = await import('@/lib/engine/research')
  campaign.research = runResearch(campaign)
  campaign.updatedAt = new Date().toISOString()
  saveCampaign(campaign)
  revalidatePath(`/studio/campaigns/${campaign.slug}/research`)
}

export async function updateCampaignSettings(id: string, updates: Partial<Pick<Campaign,
  'name' | 'service' | 'audience' | 'industry' | 'geography' | 'objective' | 'primaryCTA' | 'secondaryCTA' | 'offer'
>>) {
  const campaign = requireCampaign(id)
  Object.assign(campaign, updates)
  refreshDerived(campaign)
  saveCampaign(campaign)
  revalidatePath(`/studio/campaigns/${campaign.slug}`)
}

export async function updateCampaignCopy(id: string, copy: Campaign['copy']) {
  const campaign = requireCampaign(id)
  campaign.copy = copy
  refreshDerived(campaign)
  saveCampaign(campaign)
  revalidatePath(`/studio/campaigns/${campaign.slug}/copy`)
  revalidatePath(`/campaigns/${campaign.slug}`)
}

export async function updateCampaignSeo(id: string, seo: Campaign['seo']) {
  const campaign = requireCampaign(id)
  campaign.seo = seo
  refreshDerived(campaign)
  saveCampaign(campaign)
  revalidatePath(`/studio/campaigns/${campaign.slug}/seo`)
  revalidatePath(`/campaigns/${campaign.slug}`)
}

export async function updateCampaignTracking(id: string, tracking: Partial<Campaign['tracking']>) {
  const campaign = requireCampaign(id)
  campaign.tracking = { ...campaign.tracking, ...tracking }
  refreshDerived(campaign)
  saveCampaign(campaign)
  revalidatePath(`/studio/campaigns/${campaign.slug}/google-ads`)
}

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

export async function publishCampaign(id: string) {
  const campaign = requireCampaign(id)

  campaign.status = 'DEPLOYING'
  campaign.deployment.log.push({ at: new Date().toISOString(), message: 'Publish requested.' })

  const hasVercelCreds = Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID)

  if (!campaign.qa?.passed) {
    campaign.status = 'ERROR'
    campaign.deployment.status = 'FAILED'
    campaign.deployment.log.push({ at: new Date().toISOString(), message: 'Publish blocked — QA has not passed.' })
    saveCampaign(campaign)
    revalidatePath(`/studio/campaigns/${campaign.slug}/deployment`)
    return
  }

  if (!hasVercelCreds) {
    // Never fabricate a successful deployment (§19). The route is real and
    // already resolvable inside this one Next.js app/Vercel project the
    // moment this campaign is saved — what's missing is authorization to
    // trigger Vercel's own deployment API/promote a production build.
    campaign.deployment.status = 'PENDING_AUTHORIZATION'
    campaign.deployment.log.push({
      at: new Date().toISOString(),
      message: 'VERCEL_TOKEN / VERCEL_PROJECT_ID not set — deployment prepared but requires human authorization. See .env.example.',
    })
    campaign.status = 'QA'
  } else {
    // Real Vercel deployment would be triggered here via the Vercel REST API
    // (POST /v13/deployments) using VERCEL_TOKEN/VERCEL_PROJECT_ID, deploying
    // this same repo/app so the campaign route becomes live inside the one
    // shared Vercel project (§18/§19). Kept as an explicit, isolated call so
    // it's easy to wire up once credentials exist — never simulated here.
    try {
      const { triggerVercelDeployment } = await import('@/lib/deploy/vercel')
      const result = await triggerVercelDeployment(campaign)
      campaign.deployment.status = 'DEPLOYED'
      campaign.deployment.lastDeployedAt = new Date().toISOString()
      campaign.deployment.lastDeployId = result.deploymentId
      campaign.deployment.log.push({ at: new Date().toISOString(), message: `Deployed via Vercel API (${result.deploymentId}).` })
      campaign.status = 'DEPLOYED'
      campaign.publishedAt = campaign.publishedAt ?? new Date().toISOString()
    } catch (err) {
      campaign.deployment.status = 'FAILED'
      campaign.status = 'ERROR'
      campaign.deployment.log.push({ at: new Date().toISOString(), message: `Deployment failed: ${(err as Error).message}` })
    }
  }

  refreshDerived(campaign)
  const addressed = addVersion(campaign, `Publish attempt (${campaign.deployment.status})`, 'Deployment pipeline')
  saveCampaign(addressed)
  revalidatePath(`/studio/campaigns/${campaign.slug}/deployment`)
  revalidatePath(`/campaigns/${campaign.slug}`)
}

export async function markReadyForReview(id: string) {
  const campaign = requireCampaign(id)
  if (hasRedBlockers(campaign.blockers)) {
    throw new Error('Cannot mark ready for review while RED blockers remain.')
  }
  campaign.status = 'READY_FOR_REVIEW'
  campaign.updatedAt = new Date().toISOString()
  saveCampaign(campaign)
  revalidatePath(`/studio/campaigns/${campaign.slug}`)
}

export async function approveCampaign(id: string, approvedBy: string) {
  const campaign = requireCampaign(id)
  if (campaign.status !== 'READY_FOR_REVIEW') {
    throw new Error('Campaign must be READY_FOR_REVIEW before it can be approved.')
  }
  if (hasRedBlockers(campaign.blockers)) {
    throw new Error('Cannot approve while RED blockers remain.')
  }
  campaign.status = 'APPROVED'
  campaign.approvedAt = new Date().toISOString()
  campaign.updatedAt = campaign.approvedAt
  const versioned = addVersion(campaign, `Approved by ${approvedBy}`, approvedBy)
  saveCampaign(versioned)
  revalidatePath(`/studio/campaigns/${campaign.slug}`)
}

/**
 * The ONE action that represents launching paid advertising for this
 * campaign. Requires explicit prior APPROVED status (§39/§60) — never
 * reachable automatically from generation or deployment.
 */
export async function goLive(id: string, confirmedBy: string) {
  const campaign = requireCampaign(id)
  if (campaign.status !== 'APPROVED') {
    throw new Error('Campaign must be APPROVED by a human before it can go live.')
  }
  campaign.status = 'LIVE'
  campaign.publishedAt = campaign.publishedAt ?? new Date().toISOString()
  campaign.updatedAt = new Date().toISOString()
  const versioned = addVersion(campaign, `Marked LIVE by ${confirmedBy}`, confirmedBy)
  saveCampaign(versioned)
  revalidatePath(`/studio/campaigns/${campaign.slug}`)
}

export async function pauseCampaign(id: string) {
  const campaign = requireCampaign(id)
  campaign.status = 'PAUSED'
  campaign.updatedAt = new Date().toISOString()
  saveCampaign(campaign)
  revalidatePath(`/studio/campaigns/${campaign.slug}`)
}

export async function resumeCampaign(id: string) {
  const campaign = requireCampaign(id)
  campaign.status = campaign.approvedAt ? 'LIVE' : campaign.deployment.status === 'DEPLOYED' ? 'DEPLOYED' : 'QA'
  campaign.updatedAt = new Date().toISOString()
  saveCampaign(campaign)
  revalidatePath(`/studio/campaigns/${campaign.slug}`)
}

// ---------------------------------------------------------------------------
// Duplicate / archive / restore (§24/§25)
// ---------------------------------------------------------------------------

export async function duplicateCampaignAction(id: string, overrides: { name: string; geography?: string }) {
  const original = requireCampaign(id)
  const now = new Date().toISOString()
  const slug = uniqueSlug(overrides.name, (candidate) => slugExists(candidate))

  const clone: Campaign = JSON.parse(JSON.stringify(original))
  clone.id = randomUUID()
  clone.name = overrides.name
  clone.slug = slug
  clone.geography = overrides.geography ?? clone.geography
  clone.status = 'DRAFT'
  clone.isDemo = false
  clone.versions = []
  clone.currentVersion = 0
  clone.deployment = defaultDeployment(slug)
  clone.tracking = defaultTracking()
  clone.approvedAt = undefined
  clone.publishedAt = undefined
  clone.archivedAt = undefined
  clone.createdAt = now
  clone.updatedAt = now

  const versioned = addVersion(clone, 'Duplicated from ' + original.name, 'Studio user')
  saveCampaign(versioned)
  revalidatePath('/studio/campaigns')
  redirect(`/studio/campaigns/${slug}`)
}

export async function archiveCampaign(id: string) {
  const campaign = requireCampaign(id)
  campaign.archivedAt = new Date().toISOString()
  campaign.updatedAt = campaign.archivedAt
  ;(campaign as Campaign & { _preArchiveStatus?: string })._preArchiveStatus = campaign.status
  campaign.status = 'ARCHIVED'
  saveCampaign(campaign)
  revalidatePath('/studio/campaigns')
  revalidatePath('/studio')
}

export async function restoreCampaign(id: string) {
  const campaign = requireCampaign(id) as Campaign & { _preArchiveStatus?: string }
  campaign.status = (campaign._preArchiveStatus as Campaign['status']) ?? 'DRAFT'
  delete campaign._preArchiveStatus
  campaign.archivedAt = undefined
  campaign.updatedAt = new Date().toISOString()
  saveCampaign(campaign)
  revalidatePath('/studio/campaigns')
  revalidatePath('/studio')
}

export async function deleteCampaignPermanently(id: string) {
  // Deliberately not exposed in the UI (destructive + irreversible — §60).
  // Kept here only so the intent is explicit rather than silently absent.
  removeFromStore(id)
  revalidatePath('/studio/campaigns')
}

// ---------------------------------------------------------------------------
// Versions (§23)
// ---------------------------------------------------------------------------

export async function restoreVersion(id: string, versionNumber: number) {
  const campaign = requireCampaign(id)
  const target = campaign.versions.find((v) => v.version === versionNumber)
  if (!target) throw new Error(`Version ${versionNumber} not found`)

  campaign.strategy = target.snapshot.strategy
  campaign.copy = target.snapshot.copy
  campaign.pageStructure = target.snapshot.pageStructure
  campaign.seo = target.snapshot.seo
  refreshDerived(campaign)

  const versioned = addVersion(campaign, `Restored from version ${versionNumber}`, 'Studio user')
  saveCampaign(versioned)
  revalidatePath(`/studio/campaigns/${campaign.slug}/versions`)
  revalidatePath(`/campaigns/${campaign.slug}`)
}
