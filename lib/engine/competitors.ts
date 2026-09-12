import type { Campaign, CompetitorProfile } from '@/lib/types'

/**
 * Competitor research (master spec §13). If the brief supplied real
 * competitor URLs, one profile is created per URL, clearly marked as
 * needing a human teardown (this Studio has no live web-browsing research
 * tool wired in) rather than fabricating messaging/headlines for a company
 * nobody has actually reviewed. Never copies competitor content — only
 * records where a differentiation opportunity should be investigated.
 */
export function generateCompetitors(campaign: Campaign): CompetitorProfile[] {
  const urls = campaign.brief.competitorUrls ?? []

  if (urls.length === 0) {
    return [
      {
        id: 'placeholder-1',
        company: '[[Add a real competitor — none supplied in the campaign brief]]',
        differentiationOpportunity:
          'Add competitor URLs in Settings and re-run competitor research to populate this with a real teardown.',
      },
    ]
  }

  return urls.map((url, i) => ({
    id: `competitor-${i + 1}`,
    company: hostnameOf(url),
    url,
    differentiationOpportunity: `[[Needs human teardown]] — this Studio has no live web-research tool wired in, so positioning/messaging/headline/offer/CTA/trust-signals for ${hostnameOf(url)} must be filled in by a human reviewing the site directly rather than invented.`,
  }))
}

function hostnameOf(url: string): string {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
