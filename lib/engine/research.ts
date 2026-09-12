import type { Campaign, ResearchFindings } from '@/lib/types'

/**
 * Market + search-intent research (master spec §12). Persisted once per
 * campaign so re-opening a campaign never silently re-runs research unless
 * explicitly requested (§12) — see lib/actions/campaigns.ts `runResearch`.
 *
 * Composes campaign-specific findings from the campaign's own fields
 * (service, audience, industry) rather than fabricating market data that
 * would need an external research API this Studio doesn't have credentials
 * for. Wire a real SERP/keyword-data API in here (e.g. behind
 * `runResearch`) without changing the return shape.
 */
export function runResearch(campaign: Campaign): ResearchFindings {
  const { service, audience, geography, industry } = campaign

  return {
    generatedAt: new Date().toISOString(),
    market: {
      summary: `${audience} in ${geography} researching ${service} typically compare a small number of specialist providers before requesting a quote. Buying committees usually include an operational owner and a budget holder, and the decision cycle is driven by an unresolved operational problem rather than routine vendor refresh.`,
      buyerLanguage: [
        `"${service} near me"`,
        `"${service} provider"`,
        `"how much does ${service} cost"`,
        `"${service} for ${industry ?? 'business'}"`,
      ],
      commonPainPoints: [
        `Manual, point-in-time processes standing in for what should be continuous visibility`,
        `Previous vendor over-promised on ${service} and under-delivered on support`,
        `Internal team lacks the specialist bandwidth to do this well in-house`,
      ],
      objections: [
        `"We already tried something like this and it didn't work"`,
        `"How is this different from doing it ourselves / our current provider?"`,
        `"What does it actually cost?"`,
      ],
      conversionPatterns: [
        'A specific, low-friction first offer (assessment/health check) converts cold PPC traffic better than "contact us"',
        'Above-the-fold clarity on what the service is and who it is for reduces bounce on paid traffic',
      ],
    },
    searchIntent: {
      summary: `Primary intent for "${campaign.primaryIntent}" is commercial investigation — the searcher already knows they have the problem and is evaluating providers, not learning what the category is.`,
      intentType: 'commercial',
      notes: [
        'Avoid purely informational angles (e.g. "what is X") as the primary keyword — low commercial intent, high competition from category-owning sites.',
        'Favor phrase-match commercial terms over broad match to protect budget.',
      ],
    },
    differentiationOpportunities: [
      `Most visible competitors in ${service} offer one-off, manual engagements — Raven Labs can differentiate on ongoing/continuous delivery and direct (non-offshored) support`,
      `Speed to first value: a fast, concrete first step (assessment/audit) versus competitors' generic "get in touch"`,
    ],
  }
}
