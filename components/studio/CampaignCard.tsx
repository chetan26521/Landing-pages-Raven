import Link from 'next/link'
import { Eye, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatusBadge from './StatusBadge'
import DuplicateCampaignButton from './DuplicateCampaignButton'
import ArchiveRestoreButton from './ArchiveRestoreButton'
import type { CampaignSummary } from '@/lib/types'

export default function CampaignCard({ campaign }: { campaign: CampaignSummary }) {
  return (
    <Card className="flex flex-col h-full">
      <CardContent className="p-5 flex flex-col gap-4 h-full">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/studio/campaigns/${campaign.slug}`} className="font-display text-lg font-semibold hover:text-primary block truncate">
              {campaign.name}
            </Link>
            <p className="text-sm text-muted-foreground truncate">{campaign.service}</p>
          </div>
          {campaign.isDemo && (
            <span className="shrink-0 text-[10px] uppercase tracking-widest font-semibold text-muted-foreground border border-border rounded-full px-2 py-0.5">
              Demo
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={campaign.status} />
        </div>

        <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Geography</dt>
          <dd className="text-right truncate">{campaign.geography}</dd>
          <dt className="text-muted-foreground">Primary keyword</dt>
          <dd className="text-right truncate">{campaign.primaryKeyword}</dd>
          <dt className="text-muted-foreground">Deployment</dt>
          <dd className="text-right truncate">{campaign.deploymentStatus.replaceAll('_', ' ').toLowerCase()}</dd>
          <dt className="text-muted-foreground">Google Ads</dt>
          <dd className="text-right truncate">{campaign.googleAdsStatus.replaceAll('_', ' ').toLowerCase()}</dd>
          <dt className="text-muted-foreground">Version</dt>
          <dd className="text-right">v{campaign.version}</dd>
          <dt className="text-muted-foreground">Updated</dt>
          <dd className="text-right">{new Date(campaign.updatedAt).toLocaleDateString('en-AU')}</dd>
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 pt-2 border-t border-border">
          <Button asChild size="sm">
            <Link href={`/studio/campaigns/${campaign.slug}`}>Open →</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/studio/campaigns/${campaign.slug}/landing-page`}>
              <Eye className="w-3.5 h-3.5" /> Preview
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/campaigns/${campaign.slug}`} target="_blank">
              <ExternalLink className="w-3.5 h-3.5" /> Live page
            </Link>
          </Button>
          {campaign.status !== 'ARCHIVED' ? (
            <>
              <DuplicateCampaignButton campaignId={campaign.id} campaignName={campaign.name} geography={campaign.geography} />
              <ArchiveRestoreButton campaignId={campaign.id} archived={false} />
            </>
          ) : (
            <ArchiveRestoreButton campaignId={campaign.id} archived />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
