import ScrollReveal from '@/components/ScrollReveal'
import { Card, CardContent } from '@/components/ui/card'
import type { Campaign } from '@/lib/types'

export default function Proof({ campaign }: { campaign: Campaign }) {
  const copy = campaign.copy!.proof
  const isPlaceholder = copy.headline.startsWith('[[')
  return (
    <ScrollReveal>
      <section className="rl-section">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              {isPlaceholder ? 'Real results, once approved' : copy.headline}
            </h2>
          </div>
          <Card className={isPlaceholder ? 'border-dashed border-2' : undefined}>
            <CardContent className="p-8 md:p-12 text-center text-muted-foreground">{copy.note}</CardContent>
          </Card>
        </div>
      </section>
    </ScrollReveal>
  )
}
