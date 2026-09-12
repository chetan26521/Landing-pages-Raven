import ScrollReveal from '@/components/ScrollReveal'
import type { Campaign } from '@/lib/types'

export default function HowItWorks({ campaign }: { campaign: Campaign }) {
  const copy = campaign.copy!.howItWorks
  return (
    <ScrollReveal>
      <section className="rl-section bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{copy.headline}</h2>
            <p className="text-lg text-muted-foreground">{copy.intro}</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-5 left-[12.5%] right-[12.5%] h-0.5 bg-border" aria-hidden="true" />
            {copy.steps.map((s, i) => (
              <ScrollReveal key={i} delay={i * 100} className="relative">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold font-display relative z-10 mb-4">
                  {i + 1}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}
