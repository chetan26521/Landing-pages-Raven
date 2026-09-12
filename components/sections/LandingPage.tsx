import Script from 'next/script'
import EventTracking from '@/components/EventTracking'
import type { Campaign, SectionType } from '@/lib/types'
import Header from './Header'
import TrustBar from './TrustBar'
import Hero from './Hero'
import Problem from './Problem'
import Benefits from './Benefits'
import Proof from './Proof'
import HowItWorks from './HowItWorks'
import Faq from './Faq'
import FinalCta from './FinalCta'
import Footer from './Footer'

const SECTION_COMPONENTS: Record<SectionType, (props: { campaign: Campaign }) => JSX.Element> = {
  hero: Hero,
  'trust-bar': TrustBar,
  problem: Problem,
  benefits: Benefits,
  proof: Proof,
  'how-it-works': HowItWorks,
  faq: Faq,
  'final-cta': FinalCta,
}

/**
 * The ONE renderer used both by the public route (app/campaigns/[slug])
 * and the Studio's live preview (§21) — guarantees the preview can never
 * drift from what's actually deployed. Composes the same fixed set of
 * section components in whatever order the campaign's generated
 * PageStructure specifies (§16/§48) — never a bespoke per-campaign file.
 */
export default function LandingPage({ campaign }: { campaign: Campaign }) {
  if (!campaign.copy || !campaign.pageStructure) {
    return (
      <main className="min-h-screen grid place-items-center p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Landing page not generated yet</h1>
          <p className="text-muted-foreground">Generate this campaign from the Studio before previewing it.</p>
        </div>
      </main>
    )
  }

  const schemaData = buildSchema(campaign)

  return (
    <>
      <Script id="ldjson-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
      <EventTracking />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:z-50">
        Skip to main content
      </a>
      <Header ctaLabel={campaign.primaryCTA} />
      <main id="main">
        {campaign.pageStructure.sections
          .filter((s) => s.enabled)
          .map((section, i) => {
            const Comp = SECTION_COMPONENTS[section.type]
            return <Comp key={`${section.type}-${i}`} campaign={campaign} />
          })}
      </main>
      <Footer />
    </>
  )
}

function buildSchema(campaign: Campaign) {
  const faqs = campaign.copy!.faq.items.filter((f) => !f.a.startsWith('[['))
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: campaign.name,
        description: campaign.copy!.hero.subheadline,
        areaServed: campaign.geography,
        provider: {
          '@type': 'LocalBusiness',
          '@id': 'https://theravenlabs.com/#business',
          name: 'Raven Labs',
          url: 'https://theravenlabs.com',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  }
}
