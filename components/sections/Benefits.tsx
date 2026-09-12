import ScrollReveal from '@/components/ScrollReveal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Campaign } from '@/lib/types'
import { iconFor } from './icon-map'

export default function Benefits({ campaign }: { campaign: Campaign }) {
  const copy = campaign.copy!.benefits
  return (
    <ScrollReveal>
      <section className="rl-section bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{copy.headline}</h2>
            <p className="text-lg text-muted-foreground">{copy.intro}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {copy.items.map((item, i) => {
              const Icon = iconFor(item.icon)
              return (
                <ScrollReveal key={i} delay={i * 80}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="w-11 h-11 rounded-xl bg-primary/10 grid place-items-center mb-3">
                        <Icon className="w-6 h-6 text-primary" strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">{item.body}</CardContent>
                  </Card>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}
