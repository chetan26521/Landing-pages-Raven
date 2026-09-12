import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCampaignBySlug } from '@/lib/store'
import LandingPage from '@/components/sections/LandingPage'

/**
 * The single dynamic route every campaign's public landing page renders
 * through (master spec §17/§48) — no per-campaign source file, ever. Data
 * comes from the campaign store by slug; the route itself never changes.
 *
 * Deliberately fully dynamic (no ISR/static caching): campaigns are live,
 * frequently-edited app data (copy edits, regenerations, approvals), not
 * static content — caching a render would mean an edit, or even a brand
 * new campaign, silently keeps serving stale content (including a stale
 * 404 for a campaign that didn't exist yet at first request).
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const campaign = getCampaignBySlug(params.slug)
  if (!campaign || !campaign.seo) return { title: 'Raven Labs' }

  const seo = campaign.seo
  return {
    title: seo.title,
    description: seo.metaDescription,
    alternates: { canonical: seo.canonicalPath },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      images: seo.ogImage ? [seo.ogImage] : undefined,
      type: 'website',
      locale: 'en_AU',
    },
    twitter: { card: 'summary_large_image' },
    robots: campaign.status === 'ARCHIVED' ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default function CampaignLandingPage({ params }: { params: { slug: string } }) {
  const campaign = getCampaignBySlug(params.slug)
  if (!campaign || campaign.status === 'ARCHIVED') notFound()

  return <LandingPage campaign={campaign} />
}
