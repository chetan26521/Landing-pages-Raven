import type { Campaign, SeoConfig } from '@/lib/types'

/** Campaign-specific SEO (master spec §33/§34) — never shared across campaigns. */
export function generateSeo(campaign: Campaign): SeoConfig {
  const keyword = campaign.keywordStrategy?.primaryKeyword ?? campaign.primaryKeyword ?? campaign.service
  const title = `${titleCase(keyword)} | Raven Labs`.slice(0, 60)
  const metaDescription = `${campaign.strategy?.valueProposition ?? campaign.service} Book a free ${(campaign.offer ?? 'assessment').toLowerCase()} — no obligation.`.slice(0, 155)

  return {
    title,
    metaDescription,
    canonicalPath: `/campaigns/${campaign.slug}`,
    robots: 'index,follow',
    ogTitle: title,
    ogDescription: metaDescription,
    primaryKeyword: keyword,
  }
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1))
}
