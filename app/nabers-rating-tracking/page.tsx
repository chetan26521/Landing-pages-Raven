/**
 * Raven Labs / Fulqrom Landing Page — "Live NABERS Rating Tracking"
 * Route: /nabers-rating-tracking
 * Campaign: NABERS Rating Tracking — National Q1 2027
 *
 * Built on shadcn/ui primitives (components/ui/*) themed to Raven Labs'
 * brand purple via CSS variables in app/globals.css — see HANDOFF.md for
 * the full research/copy record and Section 1 for what's still assumed.
 * Message-matches the draft Google Ad in HANDOFF.md. Replace every
 * [[PLACEHOLDER]] before launch.
 */

import type { Metadata } from 'next'
import Script from 'next/script'
import { CheckCircle2, Gauge, LineChart, ShieldCheck, Sparkles } from 'lucide-react'

import { submitLead } from '@/lib/submit-lead'
import EventTracking from '@/components/EventTracking'
import NabersDashboardMock from '@/components/NabersDashboardMock'
import ScrollReveal from '@/components/ScrollReveal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Live NABERS Rating Tracking | Fulqrom by Raven Labs',
  description:
    'Stop guessing your NABERS star rating. Fulqrom tracks it continuously in software — see it live, fix it before assessment day. Book a free health check.',
  alternates: {
    canonical: 'https://nabers-rating.theravenlabs.com/nabers-rating-tracking',
  },
  openGraph: {
    title: 'Live NABERS Rating Tracking | Fulqrom by Raven Labs',
    description:
      'Stop guessing your NABERS star rating. Fulqrom tracks it continuously in software, all year round.',
    images: ['/og-image.png'],
    type: 'website',
    locale: 'en_AU',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

// -----------------------------------------------------------------------------
// Schema.org — Service + LocalBusiness + FAQPage
// -----------------------------------------------------------------------------
const faqs = [
  {
    q: 'What is a NABERS rating?',
    a: 'NABERS is a star rating, out of 6, that measures a building’s energy efficiency against government benchmarks using actual 12-month utility consumption data.',
  },
  {
    q: 'Does Fulqrom replace my accredited NABERS assessor?',
    a: 'No. Fulqrom tracks your rating continuously between assessments so you walk into your next official NABERS assessment with clean data and no surprises. Your accredited assessor still issues the certified rating.',
  },
  {
    q: 'How much does Fulqrom cost?',
    a: 'Pricing depends on your building’s size, meter count, and portfolio. Book a free health check and we’ll scope a fixed quote afterwards — no obligation.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most buildings are live within two weeks of connecting utility retailer data, meters, or BMS feeds — no hardware replacement required.',
  },
  {
    q: 'What buildings does Fulqrom support?',
    a: 'Commercial office (base building, tenancy, or whole building), shopping centres, hotels, and data centres across Australia.',
  },
  {
    q: 'What if I want to stop using Fulqrom?',
    a: '[[PLACEHOLDER: confirm contract terms/notice period with Nav before launch — do not publish an unconfirmed cancellation policy.]]',
  },
]

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Fulqrom Live NABERS Rating Tracking',
      description:
        'Continuous, software-based NABERS energy rating tracking for Australian commercial buildings, delivered by Raven Labs.',
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
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    },
  ],
}

const benefits = [
  {
    icon: Gauge,
    title: 'Live star rating, not a snapshot',
    body: 'See your NABERS rating trend month to month, not just once a year at assessment time.',
  },
  {
    icon: LineChart,
    title: 'No manual bill-chasing',
    body: 'Fulqrom pulls consumption data automatically from meters, BMS, and retailers — no spreadsheets.',
  },
  {
    icon: Sparkles,
    title: 'Early-warning alerts',
    body: 'Get notified the moment consumption trends put your rating at risk, with time to act.',
  },
  {
    icon: ShieldCheck,
    title: 'Audit-ready evidence',
    body: 'Hand your accredited assessor, tenants, and investors clean, continuous data on demand.',
  },
]

const steps = [
  { title: 'Book your health check', body: 'A 15-minute call to understand your building type, meters, and current rating.' },
  { title: 'Connect your data', body: 'Fulqrom connects to your meters, BMS, and utility retailer feeds — no new hardware.' },
  { title: 'See your live rating', body: 'Your NABERS star rating updates continuously on the Fulqrom dashboard.' },
  { title: 'Fix issues early', body: 'Get alerted before consumption trends put your next assessment at risk.' },
]

export default function NabersRatingTrackingPage() {
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
            <a href="#final-cta">Book my free health check</a>
          </Button>
        </div>
      </header>

      <main id="main">
        {/* ============================================
            1. HERO
        ============================================ */}
        <section className="relative overflow-hidden bg-raven-gradient text-white">
          {/* Decorative texture + glow orbs — pure CSS, no image requests */}
          <div className="absolute inset-0 rl-grid-pattern opacity-40" aria-hidden="true" />
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="container relative mx-auto grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center py-16 md:py-28">
            <div className="min-w-0">
              <Badge variant="onGradient" className="mb-5">
                Live software for Australian commercial buildings
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-5">
                Track Your NABERS Rating Live — Before It Drops, Not After
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl">
                Fulqrom gives Australian commercial building owners and facilities managers a live NABERS
                star rating, tracked continuously in software — so you catch problems months before your
                next official assessment, not after.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <Button asChild variant="onGradient" size="lg" data-cta="hero">
                  <a href="#final-cta">
                    Book my free NABERS health check
                    <span aria-hidden="true">→</span>
                  </a>
                </Button>
                <span className="text-sm opacity-85">15 minutes. No obligation. See your live rating first.</span>
              </div>
            </div>
            <div className="min-w-0 rounded-2xl overflow-hidden shadow-2xl bg-white/10 border border-white/20 p-2 backdrop-blur-sm">
              <NabersDashboardMock />
              {/* Stylised on-brand mockup, not a real product screenshot.
                  [[RECOMMENDED]] — swap for an actual Fulqrom dashboard screenshot once
                  one is available; real product UI converts better than any mockup. */}
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
              <Badge variant="secondary">Fulqrom · NABERS software</Badge>
              {/* [[PLACEHOLDER]] — add real, permitted client logos once approved by Nav.
                  Never display a client logo without explicit permission. */}
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
                Your NABERS rating is a once-a-year guess — until it isn&apos;t
              </h2>
              <p className="text-lg text-muted-foreground">
                Most building owners find out their NABERS star rating has slipped only when the annual
                assessment comes back low — after a tenant has already asked about it, or a lease clause has
                already been triggered. Chasing twelve months of utility bills after the fact doesn&apos;t
                tell you which month, which plant, or which tenancy caused the drop. By then it&apos;s too
                late to fix it for this rating cycle.
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
                  Fulqrom turns your NABERS rating into a live number, not an annual surprise
                </h2>
                <p className="text-lg text-muted-foreground">
                  Fulqrom connects to your meters, BMS, and utility retailer data to calculate your NABERS
                  star rating continuously — so you can see it move, understand why, and act before your
                  next official assessment.
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
                  [[PROOF HEADLINE — e.g. "Built on the same data discipline NABERS itself requires"]]
                </h2>
              </div>

              {/*
                [[PLACEHOLDER: request an approved case study and hard number from Nav/Ben before
                launch — e.g. "X% fewer manual reporting hours" or "Y buildings tracked continuously".
                Do not invent a stat. Google Ads will also flag unverifiable claims.]]
              */}
              <Card className="mb-8 border-dashed border-2">
                <CardContent className="p-8 md:p-12 grid md:grid-cols-[auto_1fr] gap-8 items-center">
                  <p className="text-6xl font-display font-bold text-primary leading-none">[[X%]]</p>
                  <div>
                    <p className="text-xl font-semibold mb-2">
                      [[STAT DESCRIPTION — e.g. "reduction in manual reporting time for [Client]"]]
                    </p>
                    <p className="text-muted-foreground mb-4">
                      [[Context sentence — 1-2 lines, real and attributable]]
                    </p>
                    <a href="[[case study URL]]" className="text-primary font-semibold hover:underline">
                      Read the full case study →
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Supporting testimonials — placeholders, never invented quotes */}
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
                <p className="text-lg text-muted-foreground">Live in two weeks, no hardware replacement required.</p>
              </div>
              <div className="grid md:grid-cols-4 gap-8 relative">
                {/* Connecting line on desktop */}
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
              See your live NABERS rating before your next assessment
            </h2>
            <p className="text-lg opacity-90 mb-8">
              15 minutes. No obligation. No hardware to install to find out.
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

              {/* Attribution — populated from sessionStorage by EventTracking on page load */}
              <input type="hidden" id="gclid" name="gclid" />
              <input type="hidden" id="utm_source" name="utm_source" />
              <input type="hidden" id="utm_medium" name="utm_medium" />
              <input type="hidden" id="utm_campaign" name="utm_campaign" />
              <input type="hidden" id="utm_term" name="utm_term" />
              <input type="hidden" id="utm_content" name="utm_content" />

              <Button type="submit" variant="onGradient" size="lg" data-cta="final" className="mt-1">
                <CheckCircle2 aria-hidden="true" />
                Book my free NABERS health check
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
              {/* The real logo's wordmark is black-on-transparent, so it needs a light
                  chip to stay legible on this dark footer — same authentic asset as the
                  header, not a recoloured or substituted version. */}
              <div className="inline-block bg-white rounded-lg px-3 py-2 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset, not worth the next/image optimizer */}
                <img src="/logos/raven-labs-logo.png" alt="Raven Labs" width={106} height={36} />
              </div>
              <p className="text-gray-400 max-w-md">
                Raven Labs — Australian technology and automation consultancy, and the team behind
                Fulqrom, live NABERS rating tracking software for commercial buildings. Melbourne HQ,
                delivering nationally.
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
                  {/* [[PLACEHOLDER]] — confirm the real Privacy Policy URL on theravenlabs.com before launch */}
                </li>
                <li>
                  <a href="https://theravenlabs.com/terms/" className="hover:text-white">
                    Terms &amp; Conditions
                  </a>
                  {/* [[PLACEHOLDER]] — confirm the real Terms & Conditions URL before launch */}
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
        </div>
      </footer>
    </>
  )
}
