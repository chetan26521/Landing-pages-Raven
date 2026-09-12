import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { runResearchAction } from '@/lib/actions/campaigns'

export const metadata: Metadata = { title: 'Research' }
export const dynamic = 'force-dynamic'

export default function ResearchPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)
  const research = campaign.research

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Research</h2>
          <p className="text-sm text-muted-foreground">
            {research ? `Last run ${new Date(research.generatedAt).toLocaleString('en-AU')}.` : 'Not run yet.'} Persisted per
            campaign — re-opening this tab never silently re-runs it.
          </p>
        </div>
        <form action={runResearchAction.bind(null, campaign.id)}>
          <Button type="submit" variant="outline" size="sm">Re-run research</Button>
        </form>
      </div>

      {!research ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No research yet.</CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-display font-semibold">Market</h3>
              <p className="text-sm text-muted-foreground">{research.market.summary}</p>
              <List title="Buyer language" items={research.market.buyerLanguage} />
              <List title="Common pain points" items={research.market.commonPainPoints} />
              <List title="Objections" items={research.market.objections} />
              <List title="Conversion patterns" items={research.market.conversionPatterns} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-display font-semibold">Search intent</h3>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium capitalize">{research.searchIntent.intentType}</span> — {research.searchIntent.summary}
              </p>
              <List title="Notes" items={research.searchIntent.notes} />
              <List title="Differentiation opportunities" items={research.differentiationOpportunities} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{title}</p>
      <ul className="space-y-1 text-sm list-disc list-inside">
        {items.map((i, idx) => <li key={idx}>{i}</li>)}
      </ul>
    </div>
  )
}
