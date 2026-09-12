import type { CampaignBrief } from '@/lib/types'

/**
 * Converts a short natural-language brief (master spec §7 example: "Create a
 * Google Ads campaign for Raven Labs targeting US mid-market businesses
 * looking for Salesforce automation services.") plus whatever structured
 * fields the user already filled in, into a complete CampaignBrief.
 *
 * This is deliberately a lightweight rule-based parser, not a call out to an
 * LLM API — the Studio ships with no bundled AI provider credentials, so
 * every "AI understands campaign" step in the master spec is implemented as
 * transparent, inspectable logic that composes campaign data + the Raven
 * Labs context files. See README.md "Generation engine" for how to wire a
 * real LLM into these same seams later without changing their signatures.
 */
export function buildBriefFromInput(input: {
  freeText?: string
  name?: string
  service?: string
  audience?: string
  industry?: string
  geography?: string
  objective?: string
  primaryIntent?: string
  primaryCTA?: string
  offer?: string
  existingKeywords?: string
  competitorUrls?: string
  additionalInstructions?: string
}): CampaignBrief {
  const text = input.freeText?.trim() ?? ''

  const geography =
    input.geography?.trim() ||
    extractGeography(text) ||
    'Australia'

  const audience =
    input.audience?.trim() ||
    extractAfter(text, /targeting\s+/i, /\s+(?:looking for|in need of|that need)\b.*/i) ||
    'Mid-market businesses'

  const service =
    input.service?.trim() ||
    extractAfter(text, /looking for\s+/i, /\s+services?\.?$/i) ||
    extractAfter(text, /\bfor\s+/i, /\s+services?\.?$/i) ||
    (text || 'Raven Labs services')

  const name = input.name?.trim() || titleCase(service).slice(0, 60)

  return {
    freeText: text || undefined,
    name,
    service,
    audience,
    industry: input.industry?.trim() || undefined,
    geography,
    objective: input.objective?.trim() || 'Generate qualified leads via Google Ads',
    primaryIntent: input.primaryIntent?.trim() || `${service} near me / ${service} provider`,
    primaryCTA: input.primaryCTA?.trim() || `Book my free ${service} assessment`,
    offer: input.offer?.trim() || undefined,
    existingKeywords: splitList(input.existingKeywords),
    competitorUrls: splitList(input.competitorUrls),
    additionalInstructions: input.additionalInstructions?.trim() || undefined,
  }
}

function splitList(value?: string): string[] | undefined {
  if (!value?.trim()) return undefined
  return value
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean)
}

function extractGeography(text: string): string | undefined {
  const known = ['United States', 'US', 'USA', 'Australia', 'UK', 'United Kingdom', 'Canada', 'New Zealand']
  for (const g of known) {
    if (new RegExp(`\\b${g}\\b`, 'i').test(text)) return g === 'US' || g === 'USA' ? 'United States' : g
  }
  return undefined
}

function extractAfter(text: string, startPattern: RegExp, stopPattern?: RegExp): string | undefined {
  const match = text.match(startPattern)
  if (!match) return undefined
  let rest = text.slice(match.index! + match[0].length)
  if (stopPattern) rest = rest.replace(stopPattern, '')
  const clipped = rest.split(/[.,]/)[0].trim()
  return clipped || undefined
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1))
}
