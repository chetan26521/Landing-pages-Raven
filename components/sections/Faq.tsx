import ScrollReveal from '@/components/ScrollReveal'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import type { Campaign } from '@/lib/types'

export default function Faq({ campaign }: { campaign: Campaign }) {
  const copy = campaign.copy!.faq
  return (
    <ScrollReveal>
      <section className="rl-section">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold">{copy.headline}</h2>
          </div>
          <Accordion type="single" collapsible>
            {copy.items.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </ScrollReveal>
  )
}
