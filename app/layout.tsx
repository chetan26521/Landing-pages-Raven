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
  metadataBase: new URL('https://nabers-rating.theravenlabs.com'),
  title: 'Live NABERS Rating Tracking | Fulqrom by Raven Labs',
  description:
    'Fulqrom tracks your NABERS star rating continuously in software. See it live, fix it before assessment day. Book a free NABERS health check.',
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
