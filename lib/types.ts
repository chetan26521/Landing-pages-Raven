/**
 * Raven Labs Landing Page Studio — core data model.
 *
 * A Campaign is the single unit of work in the Studio. Everything the
 * platform does — research, keywords, competitors, copy, the generated
 * landing page, SEO, Google Ads readiness, deployment, versions — hangs
 * off one Campaign record. Campaigns never share mutable data with each
 * other; duplication (see lib/engine/generate.ts) deep-clones everything
 * campaign-specific and only shares the reusable section *components*.
 */

// ---------------------------------------------------------------------------
// Lifecycle
// ---------------------------------------------------------------------------

/** See master spec §6 — statuses must reflect real state, never be faked. */
export type CampaignStatus =
  | 'DRAFT'
  | 'RESEARCHING'
  | 'STRATEGY_READY'
  | 'BUILDING'
  | 'QA'
  | 'DEPLOYING'
  | 'DEPLOYED'
  | 'READY_FOR_REVIEW'
  | 'APPROVED'
  | 'LIVE'
  | 'PAUSED'
  | 'ARCHIVED'
  | 'ERROR'

export type ReadinessLevel = 'GREEN' | 'YELLOW' | 'RED'

export interface Blocker {
  id: string
  level: ReadinessLevel
  area:
    | 'content'
    | 'links'
    | 'forms'
    | 'responsive'
    | 'technical'
    | 'seo'
    | 'deployment'
    | 'tracking'
    | 'legal'
    | 'google-ads'
  message: string
  /** What the human needs to do about it. */
  action: string
}

// ---------------------------------------------------------------------------
// Intake / brief
// ---------------------------------------------------------------------------

export interface CampaignBrief {
  /** Optional free-text natural-language brief the user typed. */
  freeText?: string
  name: string
  service: string
  audience: string
  industry?: string
  geography: string
  objective: string
  primaryIntent: string
  primaryCTA: string
  offer?: string
  existingKeywords?: string[]
  competitorUrls?: string[]
  additionalInstructions?: string
}

// ---------------------------------------------------------------------------
// Research
// ---------------------------------------------------------------------------

export interface ResearchFindings {
  generatedAt: string
  market: {
    summary: string
    buyerLanguage: string[]
    commonPainPoints: string[]
    objections: string[]
    conversionPatterns: string[]
  }
  searchIntent: {
    summary: string
    intentType: 'commercial' | 'informational' | 'transactional' | 'navigational'
    notes: string[]
  }
  differentiationOpportunities: string[]
}

// ---------------------------------------------------------------------------
// Keywords
// ---------------------------------------------------------------------------

export interface KeywordEntry {
  keyword: string
  intent: 'commercial' | 'informational' | 'transactional' | 'navigational'
  priority: 'primary' | 'secondary' | 'long-tail' | 'related'
  estimatedRelevance: 'high' | 'medium' | 'low'
  landingPageSection?: string
  notes?: string
}

export interface KeywordStrategy {
  generatedAt: string
  primaryKeyword: string
  secondaryKeywords: string[]
  longTailKeywords: string[]
  relatedTerms: string[]
  negativeKeywordRecommendations: string[]
  entries: KeywordEntry[]
}

// ---------------------------------------------------------------------------
// Competitors
// ---------------------------------------------------------------------------

export interface CompetitorProfile {
  id: string
  company: string
  url?: string
  positioning?: string
  messaging?: string
  headline?: string
  offer?: string
  cta?: string
  pageStructure?: string[]
  trustSignals?: string[]
  strengths?: string[]
  weaknesses?: string[]
  differentiationOpportunity?: string
}

// ---------------------------------------------------------------------------
// Strategy
// ---------------------------------------------------------------------------

export interface CampaignStrategy {
  generatedAt: string
  targetAudience: string
  painPoints: string[]
  searchIntent: string
  desiredOutcomes: string[]
  positioning: string
  valueProposition: string
  differentiation: string[]
  offer: string
  primaryCTA: string
  secondaryCTA?: string
  objectionHandling: { objection: string; response: string }[]
  /** Which narrative arc this campaign should use — drives page structure selection. */
  narrativeArc: 'problem-solution-proof' | 'pain-automation-roi' | 'risk-expertise-assurance'
}

// ---------------------------------------------------------------------------
// Copy + page structure (the generated landing page)
// ---------------------------------------------------------------------------

export type SectionType =
  | 'hero'
  | 'trust-bar'
  | 'problem'
  | 'benefits'
  | 'proof'
  | 'how-it-works'
  | 'faq'
  | 'final-cta'

export interface SectionConfig {
  type: SectionType
  enabled: boolean
  data: Record<string, unknown>
}

export interface CampaignCopy {
  generatedAt: string
  hero: { headline: string; subheadline: string; microcopy: string }
  problem: { headline: string; body: string }
  benefits: { headline: string; intro: string; items: { title: string; body: string; icon: string }[] }
  proof: { headline: string; note: string }
  howItWorks: { headline: string; intro: string; steps: { title: string; body: string }[] }
  faq: { headline: string; items: { q: string; a: string }[] }
  finalCta: { headline: string; body: string }
}

export interface PageStructure {
  generatedAt: string
  sections: SectionConfig[]
}

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export interface SeoConfig {
  title: string
  metaDescription: string
  canonicalPath: string
  robots: 'index,follow' | 'noindex,nofollow'
  ogTitle: string
  ogDescription: string
  ogImage?: string
  primaryKeyword: string
}

// ---------------------------------------------------------------------------
// Tracking / Google Ads
// ---------------------------------------------------------------------------

export interface TrackingConfig {
  gaId?: string
  gtmId?: string
  googleAdsId?: string
  googleAdsConversionLabel?: string
  events: string[]
}

export interface GoogleAdsReadiness {
  objective: string
  audience: string
  searchIntent: string
  primaryKeyword: string
  secondaryKeywords: string[]
  negativeKeywords: string[]
  recommendedAdMessaging: { headline: string; description: string }[]
  recommendedCTA: string
  landingPageUrl: string
  conversionEvents: string[]
  trackingConfigured: boolean
  status: 'PENDING' | 'READY_FOR_REVIEW' | 'BLOCKED'
  blockers: string[]
}

// ---------------------------------------------------------------------------
// Deployment
// ---------------------------------------------------------------------------

export interface DeploymentInfo {
  status: 'NOT_DEPLOYED' | 'PENDING_AUTHORIZATION' | 'DEPLOYED' | 'FAILED'
  vercelProject: string
  route: string
  publicUrl: string
  lastDeployedAt?: string
  lastDeployId?: string
  log: { at: string; message: string }[]
}

// ---------------------------------------------------------------------------
// QA
// ---------------------------------------------------------------------------

export interface QaCheck {
  id: string
  category: 'content' | 'links' | 'forms' | 'responsive' | 'technical' | 'seo' | 'deployment' | 'tracking'
  label: string
  passed: boolean
  detail?: string
}

export interface QaReport {
  generatedAt: string
  checks: QaCheck[]
  passed: boolean
}

// ---------------------------------------------------------------------------
// Versions
// ---------------------------------------------------------------------------

export interface CampaignVersion {
  version: number
  createdAt: string
  createdBy: string
  summary: string
  deploymentStatus: DeploymentInfo['status']
  /** Deep snapshot of the campaign's generated content at this version. */
  snapshot: {
    strategy: CampaignStrategy | null
    copy: CampaignCopy | null
    pageStructure: PageStructure | null
    seo: SeoConfig | null
  }
}

// ---------------------------------------------------------------------------
// The Campaign
// ---------------------------------------------------------------------------

export interface Campaign {
  id: string
  name: string
  slug: string
  status: CampaignStatus
  isDemo?: boolean

  service: string
  industry?: string
  audience: string
  geography: string
  objective: string
  primaryIntent: string
  primaryKeyword: string
  secondaryKeywords: string[]
  longTailKeywords: string[]
  competitors: CompetitorProfile[]

  positioning?: string
  valueProposition?: string
  painPoints: string[]
  desiredOutcomes: string[]
  offer?: string
  primaryCTA: string
  secondaryCTA?: string
  /** Which hero illustration component to use — a small, explicit set, never one file per campaign (§48). */
  heroVisual?: 'nabers-dashboard' | 'generic-dashboard'

  brief: CampaignBrief
  research: ResearchFindings | null
  keywordStrategy: KeywordStrategy | null
  strategy: CampaignStrategy | null
  copy: CampaignCopy | null
  pageStructure: PageStructure | null
  seo: SeoConfig | null
  tracking: TrackingConfig
  googleAds: GoogleAdsReadiness | null
  deployment: DeploymentInfo
  qa: QaReport | null
  blockers: Blocker[]

  versions: CampaignVersion[]
  currentVersion: number

  createdAt: string
  updatedAt: string
  approvedAt?: string
  publishedAt?: string
  archivedAt?: string
}

export interface CampaignSummary {
  id: string
  name: string
  slug: string
  status: CampaignStatus
  service: string
  geography: string
  audience: string
  primaryKeyword: string
  deploymentStatus: DeploymentInfo['status']
  googleAdsStatus: GoogleAdsReadiness['status'] | 'NOT_STARTED'
  updatedAt: string
  publicUrl: string
  version: number
  isDemo?: boolean
}
