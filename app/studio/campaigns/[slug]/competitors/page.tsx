import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Competitors' }
export const dynamic = 'force-dynamic'

export default function CompetitorsPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {campaign.competitors.map((c) => (
        <Card key={c.id}>
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold">{c.company}</h3>
              {c.url && (
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  Visit site
                </a>
              )}
            </div>
            <Field label="Positioning" value={c.positioning} />
            <Field label="Offer" value={c.offer} />
            <Field label="Headline" value={c.headline} />
            <Field label="CTA" value={c.cta} />
            <Field label="Differentiation opportunity" value={c.differentiationOpportunity} emphasis />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function Field({ label, value, emphasis }: { label: string; value?: string; emphasis?: boolean }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={emphasis ? 'text-sm text-amber-800' : 'text-sm'}>{value}</p>
    </div>
  )
}
