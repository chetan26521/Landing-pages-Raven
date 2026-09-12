import Link from 'next/link'
import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ReadinessDot from '@/components/studio/ReadinessDot'

export const metadata: Metadata = { title: 'Overview' }
export const dynamic = 'force-dynamic'

export default function OverviewPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)

  const facts: [string, string][] = [
    ['Objective', campaign.objective],
    ['Audience', campaign.audience],
    ['Service', campaign.service],
    ['Geography', campaign.geography],
    ['Primary keyword', campaign.primaryKeyword],
    ['Primary CTA', campaign.primaryCTA],
    ['Deployment URL', campaign.deployment.publicUrl],
    ['Vercel status', campaign.deployment.status.replaceAll('_', ' ')],
    ['Google Ads status', campaign.googleAds?.status ?? 'Not started'],
    ['QA status', campaign.qa ? (campaign.qa.passed ? 'All checks passed' : 'Issues found') : 'Not run'],
    ['Current version', `v${campaign.currentVersion}`],
  ]

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Campaign overview</h2>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground mb-0.5">{k}</dt>
                <dd className="text-sm break-words">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
            <Button asChild size="sm">
              <Link href={`/studio/campaigns/${params.slug}/landing-page`}>Preview landing page</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/studio/campaigns/${params.slug}/deployment`}>Deployment</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/studio/campaigns/${params.slug}/review`}>Review &amp; approve</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-semibold mb-4">Blockers &amp; next actions</h2>
          {campaign.blockers.length === 0 ? (
            <p className="text-sm text-emerald-700 flex items-center gap-2">
              <ReadinessDot level="GREEN" /> Nothing blocking — ready for the next lifecycle step.
            </p>
          ) : (
            <ul className="space-y-3">
              {campaign.blockers.map((b) => (
                <li key={b.id} className="flex gap-2.5 text-sm">
                  <ReadinessDot level={b.level} className="mt-1.5 shrink-0" />
                  <div>
                    <p className="font-medium">{b.message}</p>
                    <p className="text-muted-foreground">{b.action}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
