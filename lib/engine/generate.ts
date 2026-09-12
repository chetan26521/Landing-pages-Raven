import { randomUUID } from 'node:crypto'
import type { Campaign, CampaignBrief, DeploymentInfo, TrackingConfig } from '@/lib/types'
import { slugify, uniqueSlug } from '@/lib/slug'
import { slugExists } from '@/lib/store'
import { runResearch } from './research'
import { generateKeywords } from './keywords'
import { generateCompetitors } from './competitors'
import { generateStrategy } from './strategy'
import { generateCopy } from './copy'
import { generatePageStructure } from './structure'
import { generateSeo } from './seo'
import { generateGoogleAdsReadiness } from './google-ads'
import { runQa } from './qa'
import { computeBlockers } from './blockers'

export const VERCEL_PROJECT_NAME = 'raven-landing-page-studio'

export function defaultTracking(): TrackingConfig {
  return {
    gaId: process.env.NEXT_PUBLIC_GA_ID || undefined,
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || undefined,
    googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || undefined,
    googleAdsConversionLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || undefined,
    events: ['page_view', 'cta_click', 'form_start', 'form_submit', 'form_success', 'scroll_75', 'engaged_session'],
  }
}

export function defaultDeployment(slug: string): DeploymentInfo {
  const hasVercelCreds = Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID)
  return {
    status: hasVercelCreds ? 'NOT_DEPLOYED' : 'NOT_DEPLOYED',
    vercelProject: VERCEL_PROJECT_NAME,
    route: `/campaigns/${slug}`,
    publicUrl: `${baseUrl()}/campaigns/${slug}`,
    log: [],
  }
}

export function baseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://landing.ravenlabs.com'
}

/** Creates a brand-new Campaign record (unsaved) from a brief. Master spec §7/§8. */
export function createCampaignFromBrief(brief: CampaignBrief): Campaign {
  const now = new Date().toISOString()
  const id = randomUUID()
  const slug = uniqueSlug(brief.name, (candidate) => slugExists(candidate))

  const campaign: Campaign = {
    id,
    name: brief.name,
    slug,
    status: 'DRAFT',
    service: brief.service,
    industry: brief.industry,
    audience: brief.audience,
    geography: brief.geography,
    objective: brief.objective,
    primaryIntent: brief.primaryIntent,
    primaryKeyword: brief.existingKeywords?.[0] ?? brief.service,
    secondaryKeywords: [],
    longTailKeywords: [],
    competitors: [],
    painPoints: [],
    desiredOutcomes: [],
    offer: brief.offer,
    primaryCTA: brief.primaryCTA,
    brief,
    research: null,
    keywordStrategy: null,
    strategy: null,
    copy: null,
    pageStructure: null,
    seo: null,
    tracking: defaultTracking(),
    googleAds: null,
    deployment: defaultDeployment(slug),
    qa: null,
    blockers: [],
    versions: [],
    currentVersion: 0,
    createdAt: now,
    updatedAt: now,
  }

  return campaign
}

/**
 * Runs the full generation pipeline (master spec §50): research → keywords →
 * competitors → strategy → copy → page structure → SEO → Google Ads
 * readiness → QA → blockers. Pure function — callers (lib/actions) decide
 * whether/how to persist and version the result.
 */
export function generateCampaign(input: Campaign): Campaign {
  let campaign: Campaign = { ...input, status: 'RESEARCHING' }

  campaign.research = runResearch(campaign)
  campaign.keywordStrategy = generateKeywords(campaign)
  campaign.primaryKeyword = campaign.keywordStrategy.primaryKeyword
  campaign.secondaryKeywords = campaign.keywordStrategy.secondaryKeywords
  campaign.longTailKeywords = campaign.keywordStrategy.longTailKeywords
  campaign.competitors = generateCompetitors(campaign)

  campaign.status = 'STRATEGY_READY'
  campaign.strategy = generateStrategy(campaign)
  campaign.positioning = campaign.strategy.positioning
  campaign.valueProposition = campaign.strategy.valueProposition
  campaign.painPoints = campaign.strategy.painPoints
  campaign.desiredOutcomes = campaign.strategy.desiredOutcomes
  campaign.offer = campaign.strategy.offer

  campaign.status = 'BUILDING'
  campaign.copy = generateCopy(campaign)
  campaign.pageStructure = generatePageStructure(campaign)
  campaign.seo = generateSeo(campaign)
  campaign.googleAds = generateGoogleAdsReadiness(campaign, baseUrl())

  campaign.status = 'QA'
  campaign.qa = runQa(campaign)
  campaign.blockers = computeBlockers(campaign)

  // Generation itself never deploys or approves anything (§39 human approval
  // gate) — it only gets the campaign to a state where a human can publish
  // it from the Deployment tab. A failed QA pass is surfaced as ERROR so it
  // is never silently presented as ready.
  campaign.status = campaign.qa.passed ? 'QA' : 'ERROR'
  campaign.updatedAt = new Date().toISOString()

  return campaign
}

export { slugify }
