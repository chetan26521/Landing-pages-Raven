import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Keywords' }
export const dynamic = 'force-dynamic'

export default function KeywordsPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)
  const kw = campaign.keywordStrategy

  if (!kw) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">No keyword strategy yet — generate the campaign first.</CardContent></Card>
  }

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KeywordGroup title="Primary" items={[kw.primaryKeyword]} tone="default" />
        <KeywordGroup title="Secondary" items={kw.secondaryKeywords} tone="secondary" />
        <KeywordGroup title="Long-tail" items={kw.longTailKeywords} tone="outline" />
        <KeywordGroup title="Negative recommendations" items={kw.negativeKeywordRecommendations} tone="outline" />
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="p-3">Keyword</th>
                <th className="p-3">Intent</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Relevance</th>
                <th className="p-3">Section</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {kw.entries.map((e, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-3 font-medium">{e.keyword}</td>
                  <td className="p-3 capitalize">{e.intent}</td>
                  <td className="p-3 capitalize">{e.priority}</td>
                  <td className="p-3 capitalize">{e.estimatedRelevance}</td>
                  <td className="p-3">{e.landingPageSection ?? '—'}</td>
                  <td className="p-3 text-muted-foreground">{e.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function KeywordGroup({ title, items, tone }: { title: string; items: string[]; tone: 'default' | 'secondary' | 'outline' }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{title}</p>
        <div className="flex flex-wrap gap-1.5">
          {items.length === 0 ? (
            <span className="text-sm text-muted-foreground">None</span>
          ) : (
            items.map((k) => <Badge key={k} variant={tone}>{k}</Badge>)
          )}
        </div>
      </CardContent>
    </Card>
  )
}
