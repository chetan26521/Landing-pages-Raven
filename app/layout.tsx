import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://landing.ravenlabs.com'),
  title: {
    default: 'Raven Labs Landing Page Studio',
    template: '%s | Raven Labs',
  },
  description: 'Multi-campaign landing page management and generation platform for Raven Labs.',
  // Individual campaign routes (app/campaigns/[slug]) and the internal
  // /studio app override this per-page via generateMetadata.
  robots: { index: false, follow: false },
}

// GA4 / Google Ads IDs — set as real values in Vercel Project Settings → Environment Variables.
// Absent until a human supplies the real IDs from Raven Labs' GA4 + Google Ads admin — see .env.example.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID // e.g. G-XXXXXXXXXX
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID // e.g. AW-XXXXXXXXXX

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={poppins.variable}>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
                ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
