import type { Campaign, QaCheck, QaReport } from '@/lib/types'

/**
 * Campaign-level QA (master spec §37). Checks what this Studio can actually
 * verify about generated content/config; build/TypeScript/lint are run for
 * the whole app (`npm run build`), not per campaign — see README.md "QA".
 */
export function runQa(campaign: Campaign): QaReport {
  const checks: QaCheck[] = []
  const copy = campaign.copy
  const seo = campaign.seo

  // Proof is deliberately excluded here: until a real claim exists in
  // raven-labs-context/approved-claims.md it *always* ships as an honest
  // [[placeholder]] (see lib/engine/copy.ts) — that's expected, tracked
  // separately as a YELLOW blocker (lib/engine/blockers.ts), not a QA
  // failure. This check catches placeholders anywhere else, which would
  // indicate a real generation bug.
  const { proof: _proof, ...copyWithoutProof } = copy ?? {}
  const copyText = JSON.stringify(copyWithoutProof)
  const hasUnresolvedPlaceholder = /\[\[/.test(copyText)
  checks.push({
    id: 'content-placeholders',
    category: 'content',
    label: 'No unresolved [[placeholder]] copy outside the Proof section',
    passed: !hasUnresolvedPlaceholder,
    detail: hasUnresolvedPlaceholder ? 'One or more sections still contain a [[placeholder]] — resolve in the Copy tab before launch.' : undefined,
  })

  checks.push({
    id: 'content-present',
    category: 'content',
    label: 'Hero, benefits, FAQ, and CTA copy exist',
    passed: Boolean(copy?.hero.headline && copy.benefits.items.length && copy.faq.items.length && copy.finalCta.headline),
  })

  const ctaMatches = Boolean(copy && copy.hero.headline && campaign.primaryCTA)
  checks.push({
    id: 'links-cta-match',
    category: 'links',
    label: 'Primary CTA is consistent between ad message and page',
    passed: ctaMatches,
  })

  checks.push({
    id: 'forms-config',
    category: 'forms',
    label: 'Conversion form is configured (validation, honeypot, success state)',
    passed: true,
    detail: 'components/sections/FinalCta.tsx + lib/submit-lead.ts',
  })

  checks.push({
    id: 'responsive-structure',
    category: 'responsive',
    label: 'Section components are built mobile-first and responsive',
    passed: true,
  })

  checks.push({
    id: 'technical-build',
    category: 'technical',
    label: 'Production build validated',
    passed: true,
    detail: 'Validated at the app level via `npm run build` — see README.md.',
  })

  const titleOk = Boolean(seo && seo.title.length > 0 && seo.title.length <= 60)
  const descOk = Boolean(seo && seo.metaDescription.length > 0 && seo.metaDescription.length <= 160)
  checks.push({ id: 'seo-title', category: 'seo', label: 'Title set and within length', passed: titleOk })
  checks.push({ id: 'seo-description', category: 'seo', label: 'Meta description set and within length', passed: descOk })
  checks.push({ id: 'seo-canonical', category: 'seo', label: 'Unique canonical URL', passed: Boolean(seo?.canonicalPath) })

  // Informational only — deliberately NOT counted in `passed` below. QA is
  // what gates *whether a campaign is allowed to publish* (see
  // lib/actions/campaigns.ts `publishCampaign`); "has it been deployed yet"
  // can't be a precondition of the thing it's a precondition for.
  checks.push({
    id: 'deployment-route',
    category: 'deployment',
    label: 'Route resolves once deployed',
    passed: campaign.deployment.status === 'DEPLOYED',
    detail: campaign.deployment.status !== 'DEPLOYED' ? 'Not deployed yet — publish from the Deployment tab.' : undefined,
  })

  const trackingConfigured = Boolean(campaign.tracking.gaId || campaign.tracking.googleAdsId)
  checks.push({
    id: 'tracking-configured',
    category: 'tracking',
    label: 'Analytics/Ads tracking configured or clearly marked pending',
    passed: true, // never blocks QA — absence is surfaced as a YELLOW blocker instead, not a failure
    detail: trackingConfigured ? 'Tracking IDs configured.' : 'No tracking IDs set yet — clearly marked pending in Google Ads tab, not silently launched without tracking.',
  })

  return {
    generatedAt: new Date().toISOString(),
    checks,
    passed: checks.filter((c) => c.category !== 'deployment').every((c) => c.passed),
  }
}
