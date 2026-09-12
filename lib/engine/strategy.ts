import type { Campaign, CampaignStrategy } from '@/lib/types'

/** Campaign strategy (master spec §15) — drives page structure (§16). */
export function generateStrategy(campaign: Campaign): CampaignStrategy {
  const svc = campaign.service.toLowerCase()
  const narrativeArc = pickNarrativeArc(svc)
  const painPoints =
    campaign.research?.market.commonPainPoints ?? [
      `Manual, inconsistent ${svc} processes`,
      'No single accountable partner for the full outcome',
    ]

  return {
    generatedAt: new Date().toISOString(),
    targetAudience: campaign.audience,
    painPoints,
    searchIntent: campaign.research?.searchIntent.summary ?? campaign.primaryIntent,
    desiredOutcomes: campaign.desiredOutcomes.length
      ? campaign.desiredOutcomes
      : [`A working ${svc} outcome delivered by one accountable team`, 'Visibility into progress, not a black box'],
    positioning:
      campaign.positioning ??
      `Raven Labs delivers ${svc} directly (no offshored handoff) for ${campaign.audience.toLowerCase()} in ${campaign.geography}.`,
    valueProposition:
      campaign.valueProposition ??
      `${campaign.name} gives ${campaign.audience.toLowerCase()} a direct, accountable path to ${svc} — not another vendor to manage.`,
    differentiation:
      campaign.research?.differentiationOpportunities ?? [
        'Direct delivery team, not resold or offshored',
        'Outcome-based engagement, not time-and-materials guesswork',
      ],
    offer: campaign.offer ?? `Free ${svc} assessment`,
    primaryCTA: campaign.primaryCTA,
    secondaryCTA: campaign.secondaryCTA,
    objectionHandling: (campaign.research?.market.objections ?? []).map((objection) => ({
      objection,
      response: `Addressed directly in the FAQ section — see lib/engine/copy.ts.`,
    })),
    narrativeArc,
  }
}

function pickNarrativeArc(service: string): CampaignStrategy['narrativeArc'] {
  if (/migrat|risk|switch/.test(service)) return 'risk-expertise-assurance'
  if (/automat|ai|workflow|integrat/.test(service)) return 'pain-automation-roi'
  return 'problem-solution-proof'
}
