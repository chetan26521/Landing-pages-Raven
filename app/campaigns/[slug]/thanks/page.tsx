import Script from 'next/script'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCampaignBySlug } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Thanks | Raven Labs',
  robots: { index: false, follow: false },
}

export default function CampaignThanksPage({ params }: { params: { slug: string } }) {
  const campaign = getCampaignBySlug(params.slug)
  if (!campaign) notFound()

  const adsId = campaign.tracking.googleAdsId
  const label = campaign.tracking.googleAdsConversionLabel

  return (
    <>
      {adsId && label && (
        <Script id="ads-conversion" strategy="afterInteractive">
          {`
            if (window.gtag) {
              gtag('event', 'conversion', { 'send_to': '${adsId}/${label}' });
              gtag('event', 'generate_lead', { currency: 'AUD', value: 100 });
            }
          `}
        </Script>
      )}
      <main className="min-h-screen flex items-center justify-center bg-raven-gradient text-white p-8">
        <div className="max-w-lg text-center">
          <h1 className="rl-h1 text-4xl font-bold mb-4">Thanks — we&apos;ll be in touch shortly.</h1>
          <p className="text-lg opacity-90">
            A Raven Labs specialist will follow up on your {campaign.name.toLowerCase()} enquiry within 4 business
            hours.
          </p>
        </div>
      </main>
    </>
  )
}
