import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { publishCampaign } from '@/lib/actions/campaigns'
import { VERCEL_PROJECT_NAME } from '@/lib/engine/generate'
import CopyUrlButton from '@/components/studio/CopyUrlButton'

export const metadata: Metadata = { title: 'Deployment' }
export const dynamic = 'force-dynamic'

const STATUS_COPY: Record<string, { label: string; tone: string }> = {
  NOT_DEPLOYED: { label: 'Not deployed', tone: 'text-muted-foreground' },
  PENDING_AUTHORIZATION: { label: 'Prepared — pending Vercel authorization', tone: 'text-amber-700' },
  DEPLOYED: { label: 'Deployed', tone: 'text-emerald-700' },
  FAILED: { label: 'Failed', tone: 'text-red-700' },
}

export default function DeploymentPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)
  const d = campaign.deployment
  const status = STATUS_COPY[d.status]
  const hasVercelCreds = Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID)

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold">Vercel deployment</h3>
            <span className={`font-semibold text-sm ${status.tone}`}>{status.label}</span>
          </div>
          <dl className="grid sm:grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted-foreground text-xs uppercase tracking-widest">Project</dt><dd>{VERCEL_PROJECT_NAME}</dd></div>
            <div><dt className="text-muted-foreground text-xs uppercase tracking-widest">Route</dt><dd className="font-mono">{d.route}</dd></div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <div>
                <dt className="text-muted-foreground text-xs uppercase tracking-widest">Public URL</dt>
                <dd className="font-mono text-xs break-all">{d.publicUrl}</dd>
              </div>
              <CopyUrlButton url={d.publicUrl} />
            </div>
            {d.lastDeployedAt && (
              <div><dt className="text-muted-foreground text-xs uppercase tracking-widest">Last deployed</dt><dd>{new Date(d.lastDeployedAt).toLocaleString('en-AU')}</dd></div>
            )}
          </dl>

          {!hasVercelCreds && (
            <p className="text-sm rounded-lg bg-amber-50 border border-amber-200 text-amber-800 p-3">
              VERCEL_TOKEN / VERCEL_PROJECT_ID are not set in this environment. Publishing will validate the
              campaign and prepare it, then mark it PENDING_AUTHORIZATION rather than fabricate a live
              deployment — see .env.example.
            </p>
          )}

          <form action={publishCampaign.bind(null, campaign.id)}>
            <Button type="submit" disabled={!campaign.qa?.passed}>
              {d.status === 'DEPLOYED' ? 'Re-publish' : 'Publish'}
            </Button>
            {!campaign.qa?.passed && (
              <p className="text-xs text-muted-foreground mt-2">QA must pass before publishing — see the Overview tab.</p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-3">Deployment log</h3>
          {d.log.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {[...d.log].reverse().map((entry, i) => (
                <li key={i} className="border-l-2 border-border pl-3">
                  <p className="text-xs text-muted-foreground">{new Date(entry.at).toLocaleString('en-AU')}</p>
                  <p>{entry.message}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
