import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thanks — Your NABERS Health Check Is Booked | Raven Labs',
  robots: { index: false, follow: false },
}

// Google Ads conversion + GA4 generate_lead event.
// [[PLACEHOLDER]] — replace NEXT_PUBLIC_ADS_ID / NEXT_PUBLIC_ADS_CONVERSION_LABEL
// in Vercel env vars with the real values from Google Ads → Tools → Conversions.
export default function ThanksPage() {
  return (
    <>
      <Script id="ads-conversion" strategy="afterInteractive">
        {`
          if (window.gtag) {
            gtag('event', 'conversion', {
              'send_to': '${process.env.NEXT_PUBLIC_ADS_ID ?? 'AW-XXXXXXXXXX'}/${process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL ?? 'CONVERSION_LABEL'}',
            });
            gtag('event', 'generate_lead', { currency: 'AUD', value: 100 });
          }
        `}
      </Script>
      <main className="min-h-screen flex items-center justify-center bg-raven-gradient text-white p-8">
        <div className="max-w-lg text-center">
          <h1 className="rl-h1 text-4xl font-bold mb-4">Thanks — your NABERS health check is booked.</h1>
          <p className="text-lg opacity-90">
            A Fulqrom specialist will call you within 4 business hours to confirm your building details
            and get your live NABERS tracking set up. Check your inbox for a confirmation email.
          </p>
        </div>
      </main>
    </>
  )
}
