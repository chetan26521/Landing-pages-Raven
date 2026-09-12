import { notFound } from 'next/navigation'
import { getCampaignBySlug } from '@/lib/store'
import type { Campaign } from '@/lib/types'

export function requireCampaignBySlug(slug: string): Campaign {
  const campaign = getCampaignBySlug(slug)
  if (!campaign) notFound()
  return campaign
}
