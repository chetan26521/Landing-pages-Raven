import type { Campaign, CampaignVersion } from '@/lib/types'

/** Shared by lib/actions/campaigns.ts and lib/store/seed.ts — master spec §23. */
export function snapshotOf(campaign: Campaign): CampaignVersion['snapshot'] {
  return {
    strategy: campaign.strategy,
    copy: campaign.copy,
    pageStructure: campaign.pageStructure,
    seo: campaign.seo,
  }
}

export function addVersion(campaign: Campaign, summary: string, createdBy: string): Campaign {
  const version: CampaignVersion = {
    version: campaign.currentVersion + 1,
    createdAt: new Date().toISOString(),
    createdBy,
    summary,
    deploymentStatus: campaign.deployment.status,
    snapshot: snapshotOf(campaign),
  }
  campaign.versions = [...campaign.versions, version]
  campaign.currentVersion = version.version
  return campaign
}
