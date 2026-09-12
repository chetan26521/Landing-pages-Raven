import type { Campaign, KeywordEntry, KeywordStrategy } from '@/lib/types'

/** Keyword/search-intent research + strategy (master spec §14). */
export function generateKeywords(campaign: Campaign): KeywordStrategy {
  const svc = campaign.service.toLowerCase()
  const geo = campaign.geography

  const primaryKeyword = campaign.brief.existingKeywords?.[0] || svc
  const secondaryKeywords = dedupe([
    `${svc} services`,
    `${svc} consultant`,
    `${svc} company`,
    `${svc} ${geo.toLowerCase()}`,
  ])
  const longTailKeywords = dedupe([
    `best ${svc} provider for ${(campaign.industry ?? 'business').toLowerCase()}`,
    `how much does ${svc} cost`,
    `${svc} for ${campaign.audience.toLowerCase()}`,
    `${svc} assessment`,
  ])
  const relatedTerms = dedupe([`${svc} pricing`, `${svc} vs in-house`, `${svc} case study`])
  const negativeKeywordRecommendations = dedupe([
    'free',
    'jobs',
    'careers',
    'course',
    'tutorial',
    'diy',
    'template',
  ])

  const entries: KeywordEntry[] = [
    { keyword: primaryKeyword, intent: 'commercial', priority: 'primary', estimatedRelevance: 'high', landingPageSection: 'hero', notes: 'Drives H1/title/URL theme.' },
    ...secondaryKeywords.map((k): KeywordEntry => ({ keyword: k, intent: 'commercial', priority: 'secondary', estimatedRelevance: 'high', landingPageSection: 'benefits' })),
    ...longTailKeywords.map((k): KeywordEntry => ({ keyword: k, intent: 'informational', priority: 'long-tail', estimatedRelevance: 'medium', landingPageSection: 'faq' })),
    ...relatedTerms.map((k): KeywordEntry => ({ keyword: k, intent: 'commercial', priority: 'related', estimatedRelevance: 'low' })),
  ]

  return {
    generatedAt: new Date().toISOString(),
    primaryKeyword,
    secondaryKeywords,
    longTailKeywords,
    relatedTerms,
    negativeKeywordRecommendations,
    entries,
  }
}

function dedupe(list: string[]): string[] {
  return Array.from(new Set(list.map((s) => s.trim()).filter(Boolean)))
}
