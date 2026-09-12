import Link from 'next/link'
import type { Metadata } from 'next'
import { listCampaigns } from '@/lib/store'
import { toSummary } from '@/lib/summary'
import { hasRedBlockers } from '@/lib/engine/blockers'
import StatCard from '@/components/studio/StatCard'
import CampaignCard from '@/components/studio/CampaignCard'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const campaigns = listCampaigns()
  const active = campaigns.filter((c) => c.status !== 'ARCHIVED')
  const drafts = active.filter((c) => c.status === 'DRAFT')
  const needsReview = active.filter((c) => c.status === 'READY_FOR_REVIEW')
  const deployed = active.filter((c) => c.deployment.status === 'DEPLOYED')
  const withIssues = active.filter((c) => hasRedBlockers(c.blockers))

  const recent = [...active].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Raven Labs Landing Page Studio</h1>
          <p className="text-muted-foreground">
            Every campaign, one Vercel project. Manage research, copy, and deployment for every Raven Labs
            Google Ads landing page from here.
          </p>
        </div>
        <Button asChild>
          <Link href="/studio/campaigns/new">Create campaign</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total campaigns" value={campaigns.length} />
        <StatCard label="Active" value={active.length} />
        <StatCard label="Drafts" value={drafts.length} />
        <StatCard label="Needs review" value={needsReview.length} tone={needsReview.length ? 'warning' : 'default'} />
        <StatCard label="Deployed" value={deployed.length} tone="success" />
        <StatCard label="With issues" value={withIssues.length} tone={withIssues.length ? 'danger' : 'default'} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold">Campaigns</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/studio/campaigns">View all →</Link>
          </Button>
        </div>
        {recent.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recent.slice(0, 8).map((c) => (
              <CampaignCard key={c.id} campaign={toSummary(c)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
      <p className="text-lg font-semibold mb-2">No campaigns yet</p>
      <p className="text-muted-foreground mb-4">Create your first campaign to start generating a landing page.</p>
      <Button asChild>
        <Link href="/studio/campaigns/new">Create campaign</Link>
      </Button>
    </div>
  )
}
