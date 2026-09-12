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

// This project hosts multiple campaigns, each with its own subdomain (see
// middleware.ts + README "Per-campaign subdomains"), so there's no single
// correct metadataBase for all of them. Every campaign page sets its own
// absolute canonical/openGraph URLs, which take precedence — this is just a
// generic fallback for anything that isn't overridden.
export const metadata: Metadata = {
  metadataBase: new URL('https://landing-pages-raven.vercel.app'),
  title: 'Raven Labs',
  description: 'Raven Labs — Australian technology and automation consultancy.',
  robots: { index: true, follow: true },
}

// GA4 / Google Ads IDs — set as real values in Vercel Project Settings → Environment Variables.
// [[PLACEHOLDER]] until a human supplies the real IDs from Raven Labs' GA4 + Google Ads admin.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID // e.g. G-XXXXXXXXXX
const ADS_ID = process.env.NEXT_PUBLIC_ADS_ID // e.g. AW-XXXXXXXXXX

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
