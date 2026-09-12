import type { Campaign, CampaignCopy } from '@/lib/types'
import { hasApprovedClaims } from '@/lib/context'

/**
 * Copy generation (master spec §16). Composes campaign strategy + keywords
 * into the section-level copy the design system renders. Never invents a
 * stat/testimonial/logo — the Proof section renders an honest placeholder
 * until `raven-labs-context/approved-claims.md` has a real entry (§11, §19
 * "never fabricate data").
 */
export function generateCopy(campaign: Campaign): CampaignCopy {
  const strategy = campaign.strategy
  if (!strategy) throw new Error('generateCopy requires strategy to be generated first')

  const svc = campaign.service
  const arc = strategy.narrativeArc
  const proofHasClaims = hasApprovedClaims()

  return {
    generatedAt: new Date().toISOString(),
    hero: {
      headline: heroHeadline(campaign, arc),
      subheadline: strategy.valueProposition,
      microcopy: 'No obligation. 15 minutes to find out where you stand.',
    },
    problem: {
      headline: problemHeadline(campaign, arc),
      body: `${strategy.painPoints[0] ?? `Most ${svc.toLowerCase()} providers leave you managing the risk yourself.`} By the time it surfaces as a missed deadline or a failed migration, it's too late to fix cheaply.`,
    },
    benefits: {
      headline: benefitsHeadline(campaign, arc),
      intro: strategy.differentiation[0] ?? `Here's what changes once ${campaign.name} is in place.`,
      items: strategy.desiredOutcomes.slice(0, 4).map((outcome, i) => ({
        title: outcome,
        body: strategy.differentiation[i] ?? `Delivered directly by Raven Labs — not resold or offshored.`,
        icon: ['gauge', 'line-chart', 'sparkles', 'shield-check'][i % 4],
      })),
    },
    proof: proofHasClaims
      ? { headline: 'Proven results', note: 'See the approved case study on this campaign in raven-labs-context/case-studies.md.' }
      : {
          headline: '[[PROOF HEADLINE — add a real, approved stat or case study]]',
          note: 'No approved claim exists yet for this campaign (raven-labs-context/approved-claims.md is empty) — this section intentionally ships as a placeholder rather than an invented statistic or testimonial. A human must add a real one before launch.',
        },
    howItWorks: {
      headline: 'How it works',
      intro: `Live in weeks, not quarters.`,
      steps: [
        { title: `Book your ${strategy.offer.replace(/^Free /i, '').toLowerCase()}`, body: 'A short call to understand your current setup and goals.' },
        { title: 'We scope the plan', body: `Raven Labs maps the ${svc.toLowerCase()} work to your systems and timeline.` },
        { title: 'We deliver it', body: 'Direct delivery team, regular check-ins, no black box.' },
        { title: 'You see the outcome', body: strategy.desiredOutcomes[0] ?? 'A measurable result, not just a report.' },
      ],
    },
    faq: {
      headline: 'Frequently asked questions',
      items: buildFaq(campaign),
    },
    finalCta: {
      headline: `See what ${svc} looks like done right`,
      body: 'No obligation. No pressure. Just a clear next step.',
    },
  }
}

function heroHeadline(c: Campaign, arc: string): string {
  if (arc === 'risk-expertise-assurance') return `De-risk Your ${titleCase(c.service)} — Get It Right the First Time`
  if (arc === 'pain-automation-roi') return `Automate ${titleCase(c.service)} and Get the Hours Back`
  return `${titleCase(c.service)}, Done by a Team That Owns the Outcome`
}

function problemHeadline(c: Campaign, arc: string): string {
  if (arc === 'risk-expertise-assurance') return `${titleCase(c.service)} goes wrong more often than vendors admit`
  if (arc === 'pain-automation-roi') return `Your team is still doing ${c.service.toLowerCase()} by hand`
  return `Most ${c.service.toLowerCase()} is a guessing game — until it isn't`
}

function benefitsHeadline(c: Campaign, arc: string): string {
  if (arc === 'risk-expertise-assurance') return `Here's how Raven Labs removes the risk`
  if (arc === 'pain-automation-roi') return `What automation actually gets you back`
  return `What changes once this is handled properly`
}

function buildFaq(c: Campaign): { q: string; a: string }[] {
  const objections = c.strategy?.objectionHandling ?? []
  return [
    { q: `What exactly is included in ${c.service}?`, a: `Scope is confirmed on the ${c.strategy?.offer.toLowerCase() ?? 'initial call'} — every engagement is scoped to your systems, not sold off a fixed package.` },
    ...objections.slice(0, 2).map((o) => ({ q: o.objection.replace(/^"|"$/g, ''), a: 'Answered directly on the initial call — Raven Labs never quotes blind.' })),
    { q: 'How much does this cost?', a: `Pricing depends on scope. Book the ${c.strategy?.offer.toLowerCase() ?? 'assessment'} and we'll follow up with a fixed quote — no obligation.` },
    { q: 'How long does it take?', a: `Timelines vary by scope — confirmed on the ${c.strategy?.offer.toLowerCase() ?? 'initial call'}, not before.` },
  ]
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1))
}
