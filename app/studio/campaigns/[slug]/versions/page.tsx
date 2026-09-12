import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { restoreVersion } from '@/lib/actions/campaigns'

export const metadata: Metadata = { title: 'Versions' }
export const dynamic = 'force-dynamic'

export default function VersionsPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)
  const versions = [...campaign.versions].sort((a, b) => b.version - a.version)

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Every publish, regeneration, or approval creates a new version — restoring an old one creates version
        N+1 rather than destroying history (§23/§51).
      </p>
      {versions.map((v) => (
        <Card key={v.version}>
          <CardContent className="p-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display font-semibold">Version {v.version}</span>
                {v.version === campaign.currentVersion && (
                  <span className="text-xs uppercase tracking-widest text-primary font-semibold">Current</span>
                )}
              </div>
              <p className="text-sm">{v.summary}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(v.createdAt).toLocaleString('en-AU')} · {v.createdBy} · deployment: {v.deploymentStatus.replaceAll('_', ' ').toLowerCase()}
              </p>
            </div>
            {v.version !== campaign.currentVersion && (
              <form action={restoreVersion.bind(null, campaign.id, v.version)}>
                <Button type="submit" variant="outline" size="sm">Restore</Button>
              </form>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
