import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateCampaignTracking } from '@/lib/actions/campaigns'

export const metadata: Metadata = { title: 'Google Ads' }
export const dynamic = 'force-dynamic'

const READINESS_STYLE: Record<string, string> = {
  READY_FOR_REVIEW: 'text-emerald-700',
  PENDING: 'text-amber-700',
  BLOCKED: 'text-red-700',
}

export default function GoogleAdsPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)
  const ads = campaign.googleAds

  async function saveTracking(formData: FormData) {
    'use server'
    await updateCampaignTracking(campaign.id, {
      gaId: String(formData.get('gaId') || '') || undefined,
      googleAdsId: String(formData.get('googleAdsId') || '') || undefined,
      googleAdsConversionLabel: String(formData.get('googleAdsConversionLabel') || '') || undefined,
    })
  }

  if (!ads) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">Generate the campaign to see Google Ads readiness.</CardContent></Card>
  }

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">Readiness</h3>
              <span className={`font-semibold text-sm ${READINESS_STYLE[ads.status]}`}>{ads.status.replaceAll('_', ' ')}</span>
            </div>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground text-xs uppercase tracking-widest">Objective</dt><dd>{ads.objective}</dd></div>
              <div><dt className="text-muted-foreground text-xs uppercase tracking-widest">Audience</dt><dd>{ads.audience}</dd></div>
              <div><dt className="text-muted-foreground text-xs uppercase tracking-widest">Search intent</dt><dd>{ads.searchIntent}</dd></div>
              <div><dt className="text-muted-foreground text-xs uppercase tracking-widest">Recommended CTA</dt><dd>{ads.recommendedCTA}</dd></div>
              <div className="sm:col-span-2"><dt className="text-muted-foreground text-xs uppercase tracking-widest">Landing page URL</dt><dd className="font-mono text-xs break-all">{ads.landingPageUrl}</dd></div>
            </dl>
            {ads.blockers.length > 0 && (
              <ul className="space-y-1 text-sm text-amber-800 list-disc list-inside">
                {ads.blockers.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-display font-semibold">Recommended ad messaging</h3>
            {ads.recommendedAdMessaging.map((m, i) => (
              <div key={i} className="rounded-lg border border-border p-3">
                <p className="font-medium">{m.headline}</p>
                <p className="text-sm text-muted-foreground">{m.description}</p>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              A human still creates/reviews the ad itself in Google Ads (§39) — the Studio never launches paid
              advertising automatically.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-display font-semibold">Keywords</h3>
            <KeywordRow label="Primary" items={[ads.primaryKeyword]} />
            <KeywordRow label="Secondary" items={ads.secondaryKeywords} />
            <KeywordRow label="Negative" items={ads.negativeKeywords} />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Conversion events</p>
              <p className="text-sm font-mono">{ads.conversionEvents.join(', ')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-1">Tracking configuration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Falls back to the app-wide env vars (.env.example) when left blank — never fabricated IDs.
          </p>
          <form action={saveTracking} className="grid gap-4">
            <div>
              <Label htmlFor="gaId">GA4 measurement ID</Label>
              <Input id="gaId" name="gaId" defaultValue={campaign.tracking.gaId} placeholder="G-XXXXXXXXXX" />
            </div>
            <div>
              <Label htmlFor="googleAdsId">Google Ads conversion ID</Label>
              <Input id="googleAdsId" name="googleAdsId" defaultValue={campaign.tracking.googleAdsId} placeholder="AW-XXXXXXXXXX" />
            </div>
            <div>
              <Label htmlFor="googleAdsConversionLabel">Conversion label</Label>
              <Input id="googleAdsConversionLabel" name="googleAdsConversionLabel" defaultValue={campaign.tracking.googleAdsConversionLabel} />
            </div>
            <Button type="submit" size="sm">Save tracking</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function KeywordRow({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((k) => <Badge key={k} variant="outline">{k}</Badge>)}
      </div>
    </div>
  )
}
