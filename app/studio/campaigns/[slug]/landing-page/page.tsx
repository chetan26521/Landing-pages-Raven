import Link from 'next/link'
import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Button } from '@/components/ui/button'
import DevicePreview from '@/components/studio/DevicePreview'
import CopyUrlButton from '@/components/studio/CopyUrlButton'

export const metadata: Metadata = { title: 'Landing Page' }
export const dynamic = 'force-dynamic'

export default function LandingPagePreviewPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)
  const path = `/campaigns/${campaign.slug}`

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          This is the exact same route and component tree that renders publicly (§21) — never a divergent mock.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={path} target="_blank">Open in new tab</Link>
          </Button>
          <CopyUrlButton url={campaign.deployment.publicUrl} />
        </div>
      </div>
      <DevicePreview src={path} />
    </div>
  )
}
