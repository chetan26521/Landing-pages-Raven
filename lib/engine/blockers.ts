import type { Campaign, Blocker } from '@/lib/types'

/** Readiness/blocker model (master spec §38) — RED blocks approval, YELLOW needs human config, GREEN is done. */
export function computeBlockers(campaign: Campaign): Blocker[] {
  const blockers: Blocker[] = []

  if (campaign.qa && !campaign.qa.passed) {
    for (const check of campaign.qa.checks.filter((c) => !c.passed)) {
      blockers.push({
        id: `qa-${check.id}`,
        level: 'RED',
        area: check.category,
        message: check.detail ?? `QA check failed: ${check.label}`,
        action: 'Resolve in the relevant tab, then re-run QA.',
      })
    }
  }

  if (!campaign.tracking.gaId || !campaign.tracking.googleAdsId) {
    blockers.push({
      id: 'tracking-missing',
      level: 'YELLOW',
      area: 'tracking',
      message: 'GA4 / Google Ads tracking IDs not configured.',
      action: 'Set NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_GOOGLE_ADS_ID (see .env.example) or campaign-level overrides in Settings.',
    })
  }

  if (campaign.deployment.status !== 'DEPLOYED') {
    blockers.push({
      id: 'not-deployed',
      level: campaign.deployment.status === 'FAILED' ? 'RED' : 'YELLOW',
      area: 'deployment',
      message:
        campaign.deployment.status === 'PENDING_AUTHORIZATION'
          ? 'Deployment is prepared but requires Vercel authorization to go live.'
          : 'Landing page has not been deployed yet.',
      action:
        campaign.deployment.status === 'PENDING_AUTHORIZATION'
          ? 'Provide VERCEL_TOKEN / VERCEL_PROJECT_ID (see .env.example), then publish from the Deployment tab.'
          : 'Publish from the Deployment tab.',
    })
  }

  if (campaign.competitors.some((c) => c.differentiationOpportunity?.startsWith('[[Needs human teardown]]') || c.company.startsWith('[['))) {
    blockers.push({
      id: 'competitors-incomplete',
      level: 'YELLOW',
      area: 'content',
      message: 'Competitor research is incomplete — no verified teardown on file.',
      action: 'Review competitor URLs manually and fill in the Competitors tab.',
    })
  }

  if (!campaign.copy || /\[\[/.test(JSON.stringify(campaign.copy))) {
    blockers.push({
      id: 'proof-placeholder',
      level: 'YELLOW',
      area: 'content',
      message: 'Proof section has no approved claim yet.',
      action: 'Add a real, approved stat/case study to raven-labs-context/approved-claims.md, then regenerate copy.',
    })
  }

  // Every landing page shares components/sections/Footer.tsx, which falls
  // back to [[ABN]]/[[PHONE]]/[[EMAIL]] placeholders until a human sets the
  // NEXT_PUBLIC_BUSINESS_* env vars with Raven Labs' real legal/contact
  // details (required by Google Ads' "Adequate Information" policy). Never
  // invented — see §11/§43.
  const hasLegalDetails = Boolean(
    process.env.NEXT_PUBLIC_BUSINESS_ABN && process.env.NEXT_PUBLIC_BUSINESS_EMAIL && process.env.NEXT_PUBLIC_BUSINESS_PHONE
  )
  if (!hasLegalDetails) {
    blockers.push({
      id: 'legal-contact-details',
      level: 'RED',
      area: 'legal',
      message: 'Footer is showing [[ABN]] / [[PHONE]] / [[EMAIL]] placeholders — required by Google Ads policy.',
      action: 'Set NEXT_PUBLIC_BUSINESS_ABN / _EMAIL / _PHONE (see .env.example) with Raven Labs’ real details.',
    })
  }

  return blockers
}

export function hasRedBlockers(blockers: Blocker[]): boolean {
  return blockers.some((b) => b.level === 'RED')
}
