import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import StatusBadge from '@/components/studio/StatusBadge'
import WorkspaceTabs from '@/components/studio/WorkspaceTabs'
import ReadinessDot from '@/components/studio/ReadinessDot'

export default function CampaignWorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const campaign = requireCampaignBySlug(params.slug)
  const reds = campaign.blockers.filter((b) => b.level === 'RED').length
  const yellows = campaign.blockers.filter((b) => b.level === 'YELLOW').length

  return (
    <div className="container mx-auto py-6 space-y-4">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/studio/campaigns" className="hover:text-foreground">Campaigns</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">{campaign.name}</span>
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="font-display text-2xl font-bold truncate">{campaign.name}</h1>
          <StatusBadge status={campaign.status} />
          {campaign.isDemo && (
            <span className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground border border-border rounded-full px-2 py-0.5">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          {reds > 0 && (
            <span className="inline-flex items-center gap-1.5 text-red-700">
              <ReadinessDot level="RED" /> {reds} blocking
            </span>
          )}
          {yellows > 0 && (
            <span className="inline-flex items-center gap-1.5 text-amber-700">
              <ReadinessDot level="YELLOW" /> {yellows} need attention
            </span>
          )}
          {reds === 0 && yellows === 0 && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <ReadinessDot level="GREEN" /> All clear
            </span>
          )}
        </div>
      </div>

      <div className="border-b border-border">
        <WorkspaceTabs slug={params.slug} />
      </div>

      {children}
    </div>
  )
}
