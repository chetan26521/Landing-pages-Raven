import Link from 'next/link'
import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/studio/StatusBadge'
import ReadinessDot from '@/components/studio/ReadinessDot'
import { markReadyForReview, approveCampaign, goLive } from '@/lib/actions/campaigns'
import { hasRedBlockers } from '@/lib/engine/blockers'

export const metadata: Metadata = { title: 'Review' }
export const dynamic = 'force-dynamic'

/**
 * The Campaign Review Screen (§40) doubling as the human approval gate
 * (§39). Nothing here is reachable automatically — every transition
 * (READY_FOR_REVIEW → APPROVED → LIVE) requires an explicit click here.
 */
export default function ReviewPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)
  const blocked = hasRedBlockers(campaign.blockers)

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-display font-semibold">Campaign summary</h3>
            <StatusBadge status={campaign.status} />
          </div>
          <dl className="grid sm:grid-cols-3 gap-4 text-sm">
            <Fact label="Audience" value={campaign.audience} />
            <Fact label="Strategy" value={campaign.strategy?.narrativeArc.replaceAll('-', ' ') ?? '—'} />
            <Fact label="Primary keyword" value={campaign.primaryKeyword} />
            <Fact label="CTA" value={campaign.primaryCTA} />
            <Fact label="QA" value={campaign.qa?.passed ? 'All checks passed' : 'Issues remain'} />
            <Fact label="Google Ads readiness" value={campaign.googleAds?.status.replaceAll('_', ' ') ?? '—'} />
            <Fact label="Deployment" value={campaign.deployment.status.replaceAll('_', ' ')} />
            <Fact label="Version" value={`v${campaign.currentVersion}`} />
          </dl>
          <div className="flex gap-3 pt-2 flex-wrap">
            <Button asChild size="sm" variant="outline"><Link href={`/studio/campaigns/${params.slug}/landing-page`}>Preview</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={`/campaigns/${params.slug}`} target="_blank">Open live page</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={`/studio/campaigns/${params.slug}/research`}>Research summary</Link></Button>
            <Button asChild size="sm" variant="outline"><Link href={`/studio/campaigns/${params.slug}/competitors`}>Competitor summary</Link></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="font-display font-semibold">Readiness</h3>
          {campaign.blockers.length === 0 ? (
            <p className="text-sm text-emerald-700 flex items-center gap-2"><ReadinessDot level="GREEN" /> No blockers.</p>
          ) : (
            <ul className="space-y-2">
              {campaign.blockers.map((b) => (
                <li key={b.id} className="flex gap-2.5 text-sm">
                  <ReadinessDot level={b.level} className="mt-1.5 shrink-0" />
                  <span><strong>{b.message}</strong> — {b.action}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-display font-semibold">Human approval gate</h3>
          <p className="text-sm text-muted-foreground">
            The Studio never launches paid advertising automatically (§39/§60). Each step below requires an
            explicit action from a signed-in Raven Labs team member.
          </p>
          <div className="flex flex-wrap gap-3">
            {campaign.status !== 'READY_FOR_REVIEW' && campaign.status !== 'APPROVED' && campaign.status !== 'LIVE' && (
              <form action={markReadyForReview.bind(null, campaign.id)}>
                <Button type="submit" disabled={blocked}>Mark ready for review</Button>
              </form>
            )}
            {campaign.status === 'READY_FOR_REVIEW' && (
              <form action={approveCampaign.bind(null, campaign.id, 'Studio user')}>
                <Button type="submit" disabled={blocked}>Approve campaign</Button>
              </form>
            )}
            {campaign.status === 'APPROVED' && (
              <form action={goLive.bind(null, campaign.id, 'Studio user')}>
                <Button type="submit">Confirm — go live (launch paid advertising)</Button>
              </form>
            )}
            {campaign.status === 'LIVE' && (
              <p className="text-sm text-primary font-semibold flex items-center gap-2">
                <ReadinessDot level="GREEN" /> Live since {campaign.publishedAt ? new Date(campaign.publishedAt).toLocaleString('en-AU') : '—'}
              </p>
            )}
          </div>
          {blocked && <p className="text-xs text-red-700">Resolve every RED blocker above before this campaign can advance.</p>}
        </CardContent>
      </Card>
    </div>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="capitalize">{value}</dd>
    </div>
  )
}
