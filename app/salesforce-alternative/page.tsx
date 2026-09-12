/**
 * Raven Labs Landing Page — "Salesforce Alternative" (Salesforce → Zoho migration)
 * Route: /salesforce-alternative
 * Campaign: Salesforce Alternative — National, Conquesting Q1 2027
 *
 * Angle: competitive-conquesting on Salesforce-category search intent, pitching
 * Raven Labs' real, documented positioning (Authorised Zoho Partner) as the
 * lower-cost alternative — NOT claiming any Salesforce partnership/credential
 * Raven doesn't hold. See HANDOFF-salesforce-alternative.md for the full
 * research record and every [[PLACEHOLDER]] that needs human confirmation
 * before launch, especially the cost-comparison figures (public list pricing,
 * needs re-verification against Salesforce's and Zoho's live AU pricing pages —
 * SaaS pricing changes).
 */

import type { Metadata } from 'next'
import Script from 'next/script'
import { ArrowRightLeft, BadgeCheck, MapPin, ShieldCheck } from 'lucide-react'

import { submitLead } from '@/lib/submit-lead'
import EventTracking from '@/components/EventTracking'
import ScrollReveal from '@/components/ScrollReveal'
import SalesforceCostCompare from '@/components/SalesforceCostCompare'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Salesforce Alternative for Australian Businesses | Raven Labs',
  description:
    'Comparing Salesforce quotes? See what an Authorised Zoho Partner can build instead — enterprise CRM automation, Australian data hosting, a fraction of the cost.',
  // Canonical is the campaign's own subdomain root, not the path — see the
  // matching comment in app/nabers-rating-tracking/page.tsx for why.
  alternates: {
    canonical: 'https://salesforce-alternative.theravenlabs.com/',
  },
  openGraph: {
    title: 'Salesforce Alternative for Australian Businesses | Raven Labs',
    description:
      'Same CRM automation power as Salesforce, migrated to Zoho by an Authorised Zoho Partner — for a fraction of the licensing cost.',
    images: ['/og-image-salesforce-alternative.png'],
    type: 'website',
    locale: 'en_AU',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

const faqs = [
  {
    q: 'Is Zoho CRM really comparable to Salesforce?',
    a: 'For most small-to-mid-size Australian businesses, yes — Zoho CRM Enterprise covers workflow automation, custom modules, reporting, and integrations that cover the vast majority of what teams actually use in Salesforce day to day. Very large enterprises with deep Salesforce-specific customisation (heavy Apex code, AppExchange-only integrations) are the exception — we\'ll tell you honestly in your consultation if that\'s your situation.',
  },
  {
    q: 'How much can we actually save switching from Salesforce to Zoho?',
    a: '[[PLACEHOLDER: re-verify current Salesforce and Zoho AU list pricing before launch]] Based on published list pricing, a 30-user Salesforce Enterprise setup runs materially higher than the equivalent Zoho CRM Enterprise plan — often 70%+ lower licensing cost. Your exact saving depends on your current edition, add-ons, and user count, which is exactly what the free consultation works out.',
  },
  {
    q: 'What happens to our existing Salesforce data, automations and custom objects?',
    a: 'We map your Salesforce data architecture — custom objects, formula fields, layered automations — to Zoho CRM before a single record moves, so nothing is lost or misaligned during the switch.',
  },
  {
    q: 'How long does a Salesforce to Zoho migration take?',
    a: '[[PLACEHOLDER: confirm typical timeline with delivery team before launch]] Most standard migrations run a few weeks; more complex, multi-year Salesforce setups with heavy customisation take longer. We scope the real timeline for your setup in the consultation, not a generic number.',
  },
  {
    q: 'Do we lose functionality moving off Salesforce?',
    a: 'Standard CRM functionality — pipelines, workflow automation, reporting, integrations — carries across. Highly Salesforce-specific customisations (custom Apex logic, certain AppExchange apps) sometimes need to be rebuilt differently in Zoho. We flag anything like that upfront, not after you\'ve switched.',
  },
  {
    q: "What if we're not sure we want to switch yet?",
    a: 'That\'s exactly what the free consultation is for — no commitment. Bring your current Salesforce quote and we\'ll give you a straight comparison of cost and capability so you can decide, whether that\'s switching now, later, or not at all.',
  },
]

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Salesforce to Zoho CRM Migration',
      description:
        'CRM migration and implementation service moving Australian businesses from Salesforce to Zoho CRM, delivered by Raven Labs, an Authorised Zoho Partner.',
      areaServed: 'AU',
      provider: {
        '@type': 'LocalBusiness',
        '@id': 'https://theravenlabs.com/#business',
        name: 'Raven Labs',
        url: 'https://theravenlabs.com',
        telephone: '[[PHONE]]',
        email: '[[EMAIL]]',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Melbourne',
          addressRegion: 'VIC',
          addressCountry: 'AU',
        },
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs
        .filter((f) => !f.a.startsWith('[['))
        .map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/^\[\[.*?\]\]\s*/, '') },
        })),
    },
  ],
}

const benefits = [
  {
    icon: ArrowRightLeft,
    title: 'Up to ~75% lower licensing cost',
    body: '[[VERIFY current pricing before launch]] Based on published list pricing, Zoho CRM Enterprise runs a fraction of the equivalent Salesforce Enterprise cost for the same seat count.',
  },
  {
    icon: MapPin,
    title: 'Australian data hosting',
    body: 'Zoho now hosts data in Australia, matching data-sovereignty requirements many Australian businesses need to meet.',
  },
  {
    icon: ShieldCheck,
    title: 'Nothing lost in the move',
    body: 'We map your Salesforce objects, fields and automations to Zoho before anything migrates — verified, not guessed.',
  },
  {
    icon: BadgeCheck,
    title: 'Delivered by an Authorised Zoho Partner',
    body: 'Raven Labs is an Authorised Zoho Partner — this is our core specialism, not a side service.',
  },
]

const steps = [
  { title: 'Book your free consultation', body: 'Bring your current Salesforce quote — 30 minutes, no obligation.' },
  { title: 'We map your Salesforce setup', body: 'Objects, workflows, integrations and automations, audited before anything moves.' },
  { title: 'We migrate and rebuild in Zoho', body: 'Data integrity checked at every step — nothing silently dropped.' },
  { title: 'Your team is trained and live', body: 'Onboarding and local support included, not billed as an extra.' },
]

export default function SalesforceAlternativePage() {
  return (
    <>
      <Script
        id="ldjson-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <EventTracking />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between py-4">
          <a href="https://theravenlabs.com" target="_blank" rel="noopener" aria-label="Raven Labs home">
            {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset, not worth the next/image optimizer */}
            <img src="/logos/raven-labs-logo.png" alt="Raven Labs" width={106} height={36} />
          </a>
          <Button asChild size="sm" data-cta="header">
            <a href="#final-cta">Book my free CRM consultation</a>
          </Button>
        </div>
      </header>

      <main id="main">
        {/* ============================================
            1. HERO
        ============================================ */}
        <section className="relative overflow-hidden bg-raven-gradient text-white">
          <div className="absolute inset-0 rl-grid-pattern opacity-40" aria-hidden="true" />
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

          <div className="container relative mx-auto grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center py-16 md:py-28">
            <div className="min-w-0">
              <Badge variant="onGradient" className="mb-5">
                Authorised Zoho Partner
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-5">
                The Salesforce Alternative Australian Businesses Are Switching To
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl">
                Raven Labs migrates you from Salesforce to Zoho CRM — the same enterprise-grade
                automation your team relies on, hosted in Australia, for a fraction of the licensing
                cost.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button asChild variant="onGradient" size="lg" data-cta="hero">
                  <a href="#final-cta">
                    Book my free CRM consultation
                    <span aria-hidden="true">→</span>
                  </a>
                </Button>
                <span className="text-sm opacity-85">30 minutes. No obligation. Bring your current Salesforce quote.</span>
              </div>
            </div>
            <div className="min-w-0 rounded-2xl overflow-hidden shadow-2xl bg-white/10 border border-white/20 p-2 backdrop-blur-sm">
              <SalesforceCostCompare />
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="bg-white py-6 border-b border-border">
          <div className="container mx-auto">
            <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-4">
              Built by Raven Labs
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge variant="secondary">Authorised Zoho Partner</Badge>
              <Badge variant="secondary">Melbourne HQ · National delivery</Badge>
              <Badge variant="secondary">Data-mapped migrations</Badge>
            </div>
          </div>
        </div>

        {/* ============================================
            2. PROBLEM
        ============================================ */}
        <ScrollReveal>
          <section className="rl-section">
            <div className="container mx-auto max-w-3xl text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Salesforce pricing rarely stays where it started
              </h2>
              <p className="text-lg text-muted-foreground">
                Per-seat costs, add-on modules, and implementation consultants stack up fast as your
                team grows — and renewal time often means another price increase. Many Australian
                businesses paying enterprise Salesforce fees are running workflows a lighter, more
                affordable CRM could handle just as well, without the ongoing licensing burden.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ============================================
            3. ANSWER
        ============================================ */}
        <ScrollReveal>
          <section className="rl-section bg-muted/50">
            <div className="container mx-auto">
              <div className="max-w-2xl mx-auto text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Same CRM power. A fraction of the cost. Migrated properly.
                </h2>
                <p className="text-lg text-muted-foreground">
                  Raven Labs is an Authorised Zoho Partner — we migrate your Salesforce setup to Zoho
                  CRM with your automations, custom fields and integrations mapped and verified before
                  anything moves.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((b, i) => (
                  <ScrollReveal key={i} delay={i * 80}>
                    <Card className="h-full transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="w-11 h-11 rounded-xl bg-primary/10 grid place-items-center mb-3">
                          <b.icon className="w-6 h-6 text-primary" strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <CardTitle>{b.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-muted-foreground">{b.body}</CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ============================================
            4. PROOF
        ============================================ */}
        <ScrollReveal>
          <section className="rl-section">
            <div className="container mx-auto">
              <div className="max-w-2xl mx-auto text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold">
                  [[PROOF HEADLINE — e.g. "X businesses migrated off Salesforce, zero data lost"]]
                </h2>
              </div>

              {/*
                [[PLACEHOLDER: request an approved Salesforce-to-Zoho case study and hard number
                from Nav/Ben before launch — e.g. "X% reduction in CRM spend for [Client]".
                Do not invent a stat. Google Ads will also flag unverifiable claims.]]
              */}
              <Card className="mb-8 border-dashed border-2">
                <CardContent className="p-8 md:p-12 grid md:grid-cols-[auto_1fr] gap-8 items-center">
                  <p className="text-6xl font-display font-bold text-primary leading-none">[[X%]]</p>
                  <div>
                    <p className="text-xl font-semibold mb-2">
                      [[STAT DESCRIPTION — e.g. "reduction in CRM licensing spend for [Client]"]]
                    </p>
                    <p className="text-muted-foreground mb-4">[[Context sentence — 1-2 lines, real and attributable]]</p>
                    <a href="[[case study URL]]" className="text-primary font-semibold hover:underline">
                      Read the full case study →
                    </a>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="border-l-4 border-dashed border-l-primary">
                    <CardContent className="p-6">
                      <p className="italic mb-4 text-muted-foreground">
                        [[PLACEHOLDER: request approved testimonial from Nav — real quote only]]
                      </p>
                      <p className="font-semibold text-muted-foreground/70">[[Name]]</p>
                      <p className="text-sm text-muted-foreground/70">[[Title, Company]]</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ============================================
            5. HOW IT WORKS
        ============================================ */}
        <ScrollReveal>
          <section className="rl-section bg-muted/50">
            <div className="container mx-auto">
              <div className="max-w-2xl mx-auto text-center mb-14">
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How it works</h2>
                <p className="text-lg text-muted-foreground">A structured migration, not a guess-and-hope data dump.</p>
              </div>
              <div className="grid md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-border" aria-hidden="true" />
                {steps.map((s, i) => (
                  <ScrollReveal key={i} delay={i * 100} className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold font-display relative z-10 mb-4">
                      {i + 1}
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                    <p className="text-muted-foreground">{s.body}</p>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ============================================
            6. FAQ
        ============================================ */}
        <ScrollReveal>
          <section className="rl-section">
            <div className="container mx-auto max-w-3xl">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold">Frequently asked questions</h2>
              </div>
              <Accordion type="single" collapsible>
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </ScrollReveal>

        {/* ============================================
            7. FINAL CTA
        ============================================ */}
        <section id="final-cta" className="relative overflow-hidden rl-section bg-raven-gradient text-white">
          <div className="absolute inset-0 rl-grid-pattern opacity-30" aria-hidden="true" />
          <div className="container relative mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              See what Zoho would cost instead of your next Salesforce renewal
            </h2>
            <p className="text-lg opacity-90 mb-8">
              30 minutes. No obligation. Bring your current Salesforce quote.
            </p>

            <form
              action={submitLead}
              className="relative grid gap-4 p-6 md:p-8 bg-white/10 backdrop-blur rounded-2xl text-left shadow-xl"
              noValidate
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name" className="text-white/90">
                    First name
                  </Label>
                  <Input id="first_name" name="first_name" required autoComplete="given-name" onGradient />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white/90">
                    Work email
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    onGradient
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company" className="text-white/90">
                  Company
                </Label>
                <Input id="company" name="company" required autoComplete="organization" onGradient />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white/90">
                  Phone (optional)
                </Label>
                <Input type="tel" id="phone" name="phone" autoComplete="tel" inputMode="tel" onGradient />
              </div>

              {/* Honeypot */}
              <div className="absolute -left-[9999px] w-px h-px" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              {/* Which campaign this lead came from — required by lib/submit-lead.ts */}
              <input type="hidden" name="campaign" value="salesforce-alternative" />

              {/* Attribution — populated from sessionStorage by EventTracking on page load */}
              <input type="hidden" id="gclid" name="gclid" />
              <input type="hidden" id="utm_source" name="utm_source" />
              <input type="hidden" id="utm_medium" name="utm_medium" />
              <input type="hidden" id="utm_campaign" name="utm_campaign" />
              <input type="hidden" id="utm_term" name="utm_term" />
              <input type="hidden" id="utm_content" name="utm_content" />

              <Button type="submit" variant="onGradient" size="lg" data-cta="final" className="mt-1">
                Book my free CRM consultation
              </Button>
              <p className="text-xs opacity-80 text-center">
                By submitting, you agree to our{' '}
                <a href="https://theravenlabs.com/privacy-policy/" className="underline">
                  Privacy Policy
                </a>
                . We reply within 4 business hours.
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* Footer — required for Google Ads "Adequate Information" policy */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-8 mb-8">
            <div>
              <div className="inline-block bg-white rounded-lg px-3 py-2 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset, not worth the next/image optimizer */}
                <img src="/logos/raven-labs-logo.png" alt="Raven Labs" width={106} height={36} />
              </div>
              <p className="text-gray-400 max-w-md">
                Raven Labs — Australian technology and automation consultancy, and an Authorised Zoho
                Partner. Melbourne HQ, delivering nationally.
              </p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="https://theravenlabs.com/about/" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="https://theravenlabs.com/case-studies/" className="hover:text-white">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="https://theravenlabs.com/contact/" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-widest mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="https://theravenlabs.com/privacy-policy/" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://theravenlabs.com/terms/" className="hover:text-white">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-wrap justify-between gap-4 text-sm text-gray-400">
            {/* [[PLACEHOLDER]] — ABN, phone, email are required by Google Ads policy. Confirm with Nav before launch. */}
            <div>© {new Date().getFullYear()} Raven Labs Pty Ltd. ABN [[ABN]]. All rights reserved.</div>
            <div>
              Melbourne, VIC · <a href="mailto:[[EMAIL]]" className="hover:text-white">[[EMAIL]]</a> · [[PHONE]]
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 max-w-3xl">
            Salesforce is a registered trademark of Salesforce, Inc. Raven Labs is not affiliated with,
            endorsed by, or a partner of Salesforce, Inc. Pricing comparisons are based on published
            list pricing at time of writing and may not reflect current rates.
          </p>
        </div>
      </footer>
    </>
  )
}
