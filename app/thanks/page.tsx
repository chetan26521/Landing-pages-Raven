import Script from 'next/script'
import type { Metadata } from 'next'

/**
 * Shared thank-you page for every campaign in this project.
 * Reads ?campaign=<slug> (set by lib/submit-lead.ts on redirect) to show the
 * right confirmation copy AND fire the right Google Ads conversion label —
 * critical once more than one campaign runs at once, since each Google Ads
 * conversion action needs its own label. The AW- account ID is shared
 * (one Google Ads account); only the label differs per campaign.
 *
 * Adding a new campaign? Add one entry here with its own conversionLabelEnv,
 * and set that env var in Vercel once the human has the real label from
 * Google Ads → Tools → Conversions.
 */
const CAMPAIGNS: Record<
  string,
  { heading: string; body: string; conversionLabelEnv: string }
> = {
  'nabers-rating-tracking': {
    heading: 'Thanks — your NABERS health check is booked.',
    body: 'A Fulqrom specialist will call you within 4 business hours to confirm your building details and get your live NABERS tracking set up. Check your inbox for a confirmation email.',
    conversionLabelEnv: 'NEXT_PUBLIC_ADS_CONVERSION_LABEL_NABERS_RATING_TRACKING',
  },
  'salesforce-alternative': {
    heading: 'Thanks — your free CRM consultation is booked.',
    body: 'A Raven Labs CRM specialist will call you within 4 business hours to talk through your current Salesforce setup and what a Zoho migration would look like for your team. Check your inbox for a confirmation email.',
    conversionLabelEnv: 'NEXT_PUBLIC_ADS_CONVERSION_LABEL_SALESFORCE_ALTERNATIVE',
  },
}

const DEFAULT_CAMPAIGN = {
  heading: "Thanks — we're on it.",
  body: 'A Raven Labs specialist will be in touch within 4 business hours. Check your inbox for a confirmation email.',
  conversionLabelEnv: 'NEXT_PUBLIC_ADS_CONVERSION_LABEL',
}

export const metadata: Metadata = {
  title: 'Thanks | Raven Labs',
  robots: { index: false, follow: false },
}

// Google Ads conversion + GA4 generate_lead event.
// [[PLACEHOLDER]] — replace NEXT_PUBLIC_ADS_ID and each campaign's conversion-label
// env var in Vercel with the real values from Google Ads → Tools → Conversions.
export default function ThanksPage({
  searchParams,
}: {
  searchParams: { campaign?: string }
}) {
  const campaign = searchParams.campaign ? CAMPAIGNS[searchParams.campaign] : undefined
  const { heading, body, conversionLabelEnv } = campaign ?? DEFAULT_CAMPAIGN
  const conversionLabel = process.env[conversionLabelEnv] ?? 'CONVERSION_LABEL'

  return (
    <>
      <Script id="ads-conversion" strategy="afterInteractive">
        {`
          if (window.gtag) {
            gtag('event', 'conversion', {
              'send_to': '${process.env.NEXT_PUBLIC_ADS_ID ?? 'AW-XXXXXXXXXX'}/${conversionLabel}',
            });
            gtag('event', 'generate_lead', { currency: 'AUD', value: 100 });
          }
        `}
      </Script>
      <main className="min-h-screen flex items-center justify-center bg-raven-gradient text-white p-8">
        <div className="max-w-lg text-center">
          <h1 className="rl-h1 text-4xl font-bold mb-4">{heading}</h1>
          <p className="text-lg opacity-90">{body}</p>
        </div>
      </main>
    </>
  )
}
