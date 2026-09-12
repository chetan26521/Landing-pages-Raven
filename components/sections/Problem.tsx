import ScrollReveal from '@/components/ScrollReveal'
import type { Campaign } from '@/lib/types'

export default function Problem({ campaign }: { campaign: Campaign }) {
  const copy = campaign.copy!.problem
  return (
    <ScrollReveal>
      <section className="rl-section">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{copy.headline}</h2>
          <p className="text-lg text-muted-foreground">{copy.body}</p>
        </div>
      </section>
    </ScrollReveal>
  )
}
