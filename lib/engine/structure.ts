import type { Campaign, PageStructure, SectionConfig } from '@/lib/types'

/**
 * Selects and orders the reusable sections for a campaign's landing page
 * (master spec §16/§48). Same section components every time — only the
 * order and enabled set change per narrative arc, so campaigns never look
 * identical but the codebase never grows a new file per campaign.
 */
export function generatePageStructure(campaign: Campaign): PageStructure {
  const arc = campaign.strategy?.narrativeArc ?? 'problem-solution-proof'

  const order: SectionConfig['type'][] =
    arc === 'risk-expertise-assurance'
      ? ['hero', 'trust-bar', 'problem', 'how-it-works', 'benefits', 'proof', 'faq', 'final-cta']
      : arc === 'pain-automation-roi'
        ? ['hero', 'trust-bar', 'problem', 'benefits', 'how-it-works', 'proof', 'faq', 'final-cta']
        : ['hero', 'trust-bar', 'problem', 'benefits', 'proof', 'how-it-works', 'faq', 'final-cta']

  return {
    generatedAt: new Date().toISOString(),
    sections: order.map((type) => ({ type, enabled: true, data: {} })),
  }
}
