import type { Campaign, GoogleAdsReadiness } from '@/lib/types'

/** Google Ads preparation (master spec §30) — kept campaign-specific, never launches ads itself (§39). */
export function generateGoogleAdsReadiness(campaign: Campaign, baseUrl: string): GoogleAdsReadiness {
  const kw = campaign.keywordStrategy
  const trackingConfigured = Boolean(
    campaign.tracking.gaId && campaign.tracking.googleAdsId && campaign.tracking.googleAdsConversionLabel
  )

  const blockers: string[] = []
  if (!trackingConfigured) blockers.push('Google Ads conversion tracking IDs not configured (Settings → Tracking).')
  if (!campaign.qa?.passed) blockers.push('QA has not fully passed yet.')
  if (campaign.deployment.status !== 'DEPLOYED') blockers.push('Landing page is not deployed yet.')

  return {
    objective: campaign.objective,
    audience: campaign.audience,
    searchIntent: campaign.strategy?.searchIntent ?? campaign.primaryIntent,
    primaryKeyword: kw?.primaryKeyword ?? campaign.primaryKeyword,
    secondaryKeywords: kw?.secondaryKeywords ?? campaign.secondaryKeywords,
    negativeKeywords: kw?.negativeKeywordRecommendations ?? [],
    recommendedAdMessaging: [
      { headline: campaign.copy?.hero.headline.slice(0, 30) ?? campaign.name, description: campaign.copy?.hero.subheadline.slice(0, 90) ?? '' },
      { headline: campaign.primaryCTA.slice(0, 30), description: campaign.copy?.finalCta.body.slice(0, 90) ?? '' },
    ],
    recommendedCTA: campaign.primaryCTA,
    landingPageUrl: `${baseUrl}/campaigns/${campaign.slug}`,
    conversionEvents: campaign.tracking.events,
    trackingConfigured,
    status: blockers.length === 0 ? 'READY_FOR_REVIEW' : campaign.deployment.status === 'DEPLOYED' ? 'PENDING' : 'BLOCKED',
    blockers,
  }
}
