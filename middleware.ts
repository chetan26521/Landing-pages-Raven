import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Per-campaign subdomains.
 *
 * Maps a subdomain to the campaign route it should serve at its root ("/").
 * Add one entry here for every new campaign that gets its own subdomain —
 * and see README.md "Per-campaign subdomains" for the DNS + Vercel dashboard
 * steps that have to happen alongside this (this file alone does nothing
 * until those are done).
 *
 * This only rewrites the subdomain's root path. Everything else — /thanks,
 * /_next/*, /og-image.png, /icon.svg — resolves normally regardless of which
 * domain or subdomain served the request, since those are shared across
 * every campaign.
 */
const SUBDOMAIN_TO_CAMPAIGN_PATH: Record<string, string> = {
  'nabers-rating-tracking': '/nabers-rating-tracking',
  'salesforce-alternative': '/salesforce-alternative',
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const hostname = host.split(':')[0] // strip the port for local dev (localhost:3000)
  const subdomain = hostname.split('.')[0]

  const campaignPath = SUBDOMAIN_TO_CAMPAIGN_PATH[subdomain]

  // Only the root path of a recognised campaign subdomain gets rewritten.
  // Unrecognised hosts (the default Vercel domain, preview deployments,
  // localhost) fall through untouched — path-based access (/nabers-rating-
  // tracking etc.) keeps working exactly as before.
  if (campaignPath) {
    const url = request.nextUrl.clone()
    url.pathname = campaignPath
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  // Root path only — every other path (assets, /thanks, campaign paths
  // themselves) is already correct without any rewrite.
  matcher: ['/'],
}
