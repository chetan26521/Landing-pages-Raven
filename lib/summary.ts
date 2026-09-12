import type { Campaign, CampaignSummary } from '@/lib/types'

export function toSummary(campaign: Campaign): CampaignSummary {
  return {
    id: campaign.id,
    name: campaign.name,
    slug: campaign.slug,
    status: campaign.status,
    service: campaign.service,
    geography: campaign.geography,
    audience: campaign.audience,
    primaryKeyword: campaign.primaryKeyword,
    deploymentStatus: campaign.deployment.status,
    googleAdsStatus: campaign.googleAds?.status ?? 'NOT_STARTED',
    updatedAt: campaign.updatedAt,
    publicUrl: campaign.deployment.publicUrl,
    version: campaign.currentVersion,
    isDemo: campaign.isDemo,
  }
}
