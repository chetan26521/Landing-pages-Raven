/**
 * Raven Labs / Fulqrom Landing Page — "Live NABERS Rating Tracking"
 * Route: /nabers-rating-tracking
 * Campaign: NABERS Rating Tracking — National Q1 2027
 *
 * Message-matches the draft Google Ad in HANDOFF.md. Replace every
 * [[PLACEHOLDER]] before launch — see the Assumptions & Defaults section
 * of HANDOFF.md for what each one needs and why it's flagged.
 */

import type { Metadata } from 'next'
import Script from 'next/script'
import { submitLead } from '@/lib/submit-lead'
import EventTracking from '@/components/EventTracking'
import NabersDashboardMock from '@/components/NabersDashboardMock'

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
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is a NABERS rating?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'NABERS (National Australian Built Environment Rating System) is a star rating, out of 6, that measures a building’s energy efficiency against government benchmarks using actual 12-month utility consumption data.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Fulqrom replace my accredited NABERS assessor?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Fulqrom tracks your rating continuously between assessments so you walk into your next official NABERS assessment with clean data and no surprises. Your accredited assessor still issues the certified rating.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to see my live NABERS rating in Fulqrom?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most buildings are live within two weeks of connecting utility retailer data, meters, or BMS feeds — no hardware replacement required.',
          },
        },
        {
          '@type': 'Question',
          name: 'What buildings does Fulqrom support?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Commercial office (base building, tenancy, or whole building), shopping centres, hotels, and data centres across Australia.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does Fulqrom cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pricing depends on your building’s size, meter count, and portfolio. Book a free NABERS health check and we’ll scope a fixed quote afterwards — no obligation.',
          },
        },
      ],
    },
  ],
}

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
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="https://theravenlabs.com" target="_blank" rel="noopener" aria-label="Raven Labs home">
            {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> for SVGs; next/image's optimizer 400s on SVG sources */}
            <img src="/logos/raven-labs-wordmark.svg" alt="Raven Labs" width={140} height={32} />
          </a>
          <a
            href="#final-cta"
            className="inline-flex items-center px-4 py-2 bg-raven-purple text-white font-semibold rounded-md hover:bg-raven-purple3 transition text-sm md:text-base"
            data-cta="header"
          >
            Book my free health check
          </a>
        </div>
      </header>

      <main id="main">
        {/* ============================================
            1. HERO
        ============================================ */}
        <section className="bg-raven-gradient text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-[1.1fr_1fr] gap-8 md:gap-16 items-center">
            <div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
                Track Your NABERS Rating Live — Before It Drops, Not After
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-6">
                Fulqrom gives Australian commercial building owners and facilities managers a live NABERS
                star rating, tracked continuously in software — so you catch problems months before your
                next official assessment, not after.
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                <a
                  href="#final-cta"
                  className="inline-flex items-center gap-2 min-h-12 px-6 bg-white text-raven-purple font-semibold rounded-md hover:bg-gray-100 transition shadow-lg text-lg"
                  data-cta="hero"
                >
                  Book my free NABERS health check →
                </a>
                <span className="text-sm opacity-85">15 minutes. No obligation. See your live rating first.</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 border border-white/20 p-2">
              <NabersDashboardMock />
              {/* This is a stylised on-brand mockup, not a real product screenshot.
                  [[RECOMMENDED]] — swap for an actual Fulqrom dashboard screenshot once
                  one is available; real product UI converts better than any mockup. */}
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="bg-white py-6 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-4">
              Built by Raven Labs — Authorised Zoho Partner
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> for SVGs; next/image's optimizer 400s on SVG sources */}
              <img src="/logos/fulqrom-badge.svg" alt="Fulqrom" width={120} height={36} className="opacity-90" />
              {/* [[PLACEHOLDER]] — add real, permitted client logos once approved by Nav.
                  Never display a client logo without explicit permission. */}
            </div>
          </div>
        </div>

        {/* ============================================
            2. PROBLEM
        ============================================ */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Your NABERS rating is a once-a-year guess — until it isn&apos;t
            </h2>
            <p className="text-lg text-gray-600">
              Most building owners find out their NABERS star rating has slipped only when the annual
              assessment comes back low — after a tenant has already asked about it, or a lease clause has
              already been triggered. Chasing twelve months of utility bills after the fact doesn&apos;t
              tell you which month, which plant, or which tenancy caused the drop. By then it&apos;s too
              late to fix it for this rating cycle.
            </p>
          </div>
        </section>

        {/* ============================================
            3. ANSWER
        ============================================ */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Fulqrom turns your NABERS rating into a live number, not an annual surprise
              </h2>
              <p className="text-lg text-gray-600">
                Fulqrom connects to your meters, BMS, and utility retailer data to calculate your NABERS
                star rating continuously — so you can see it move, understand why, and act before your
                next official assessment.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: 'M12 2v4m0 12v4m10-10h-4M6 12H2m15.36-6.36l-2.83 2.83M9.47 14.53l-2.83 2.83m0-10.6l2.83 2.83m5.06 5.06l2.83 2.83',
                  title: 'Live star rating, not a snapshot',
                  body: 'See your NABERS rating trend month to month, not just once a year at assessment time.',
                },
                {
                  icon: 'M9 17V9m3 8V5m3 12v-4M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z',
                  title: 'No manual bill-chasing',
                  body: 'Fulqrom pulls consumption data automatically from meters, BMS, and retailers — no spreadsheets.',
                },
                {
                  icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zM12 15.75h.007v.008H12v-.008z',
                  title: 'Early-warning alerts',
                  body: 'Get notified the moment consumption trends put your rating at risk, with time to act.',
                },
                {
                  icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
                  title: 'Audit-ready evidence',
                  body: 'Hand your accredited assessor, tenants, and investors clean, continuous data on demand.',
                },
              ].map((b, i) => (
                <div key={i} className="p-8 bg-white rounded-2xl shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-raven-purple/10 grid place-items-center mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#4a00e1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
                      <path d={b.icon} />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{b.title}</h3>
                  <p className="text-gray-600">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            4. PROOF
        ============================================ */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
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
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md mb-8 grid md:grid-cols-[auto_1fr] gap-8 items-center border-2 border-dashed border-gray-300">
              <div>
                <p className="text-6xl font-display font-bold text-raven-purple leading-none">[[X%]]</p>
              </div>
              <div>
                <p className="text-xl font-semibold mb-2">
                  [[STAT DESCRIPTION — e.g. "reduction in manual reporting time for [Client]"]]
                </p>
                <p className="text-gray-600 mb-4">[[Context sentence — 1-2 lines, real and attributable]]</p>
                <a href="[[case study URL]]" className="text-raven-purple font-semibold hover:underline">
                  Read the full case study →
                </a>
              </div>
            </div>

            {/* Supporting testimonials — placeholders, never invented quotes */}
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-xl border-l-4 border-dashed border-raven-purple shadow-sm"
                >
                  <p className="italic mb-4 text-gray-500">
                    [[PLACEHOLDER: request approved testimonial from Nav — real quote only]]
                  </p>
                  <p className="font-semibold text-gray-400">[[Name]]</p>
                  <p className="text-sm text-gray-400">[[Title, Company]]</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            5. HOW IT WORKS
        ============================================ */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How it works</h2>
              <p className="text-lg text-gray-600">Live in two weeks, no hardware replacement required.</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  title: 'Book your health check',
                  body: 'A 15-minute call to understand your building type, meters, and current rating.',
                },
                {
                  title: 'Connect your data',
                  body: 'Fulqrom connects to your meters, BMS, and utility retailer feeds — no new hardware.',
                },
                {
                  title: 'See your live rating',
                  body: 'Your NABERS star rating updates continuously on the Fulqrom dashboard.',
                },
                {
                  title: 'Fix issues early',
                  body: 'Get alerted before consumption trends put your next assessment at risk.',
                },
              ].map((s, i) => (
                <div key={i} className="relative pt-14">
                  <div className="absolute top-0 left-0 w-10 h-10 bg-raven-purple text-white rounded-full grid place-items-center font-bold">
                    {i + 1}
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-gray-600">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            6. FAQ
        ============================================ */}
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold">Frequently asked questions</h2>
            </div>
            <div className="space-y-2">
              {[
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
              ].map((f, i) => (
                <details key={i} className="border-b border-gray-200 py-5 group">
                  <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center">
                    <span>{f.q}</span>
                    <span className="text-2xl text-raven-purple group-open:rotate-45 transition">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            7. FINAL CTA
        ============================================ */}
        <section id="final-cta" className="py-16 md:py-24 bg-raven-gradient text-white">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              See your live NABERS rating before your next assessment
            </h2>
            <p className="text-lg opacity-90 mb-8">
              15 minutes. No obligation. No hardware to install to find out.
            </p>

            <form
              action={submitLead}
              className="relative grid gap-4 p-6 bg-white/10 backdrop-blur rounded-2xl text-left"
              noValidate
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="text-sm font-medium block mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    required
                    autoComplete="given-name"
                    className="w-full min-h-12 px-4 py-3 bg-white/10 border-2 border-white/20 text-white rounded-md placeholder:text-white/60 focus:border-white outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium block mb-1">
                    Work email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    className="w-full min-h-12 px-4 py-3 bg-white/10 border-2 border-white/20 text-white rounded-md focus:border-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="company" className="text-sm font-medium block mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  autoComplete="organization"
                  className="w-full min-h-12 px-4 py-3 bg-white/10 border-2 border-white/20 text-white rounded-md focus:border-white outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-sm font-medium block mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  className="w-full min-h-12 px-4 py-3 bg-white/10 border-2 border-white/20 text-white rounded-md focus:border-white outline-none"
                />
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

              <button
                type="submit"
                className="min-h-12 px-6 bg-white text-raven-purple font-semibold rounded-md hover:bg-gray-100 transition shadow-lg text-lg"
                data-cta="final"
              >
                Book my free NABERS health check →
              </button>
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
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-[2fr_1fr_1fr] gap-8 mb-8">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element -- plain <img> for SVGs; next/image's optimizer 400s on SVG sources */}
              <img
                src="/logos/raven-labs-wordmark-white.svg"
                alt="Raven Labs"
                width={140}
                height={32}
                className="mb-4"
              />
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
