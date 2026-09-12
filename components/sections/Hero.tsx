import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import NabersDashboardMock from '@/components/NabersDashboardMock'
import GenericHeroVisual from './GenericHeroVisual'
import type { Campaign } from '@/lib/types'

export default function Hero({ campaign }: { campaign: Campaign }) {
  const copy = campaign.copy!.hero
  return (
    <section className="relative overflow-hidden bg-raven-gradient text-white">
      <div className="absolute inset-0 rl-grid-pattern opacity-40" aria-hidden="true" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl" aria-hidden="true" />

      <div className="container relative mx-auto grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center py-16 md:py-28">
        <div className="min-w-0">
          <Badge variant="onGradient" className="mb-5">
            {campaign.geography} · {campaign.service}
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-5">
            {copy.headline}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-xl">{copy.subheadline}</p>
          <div className="flex flex-wrap gap-4 items-center">
            <Button asChild variant="onGradient" size="lg" data-cta="hero">
              <a href="#final-cta">
                {campaign.primaryCTA}
                <span aria-hidden="true">→</span>
              </a>
            </Button>
            <span className="text-sm opacity-85">{copy.microcopy}</span>
          </div>
        </div>
        <div className="min-w-0 rounded-2xl overflow-hidden shadow-2xl bg-white/10 border border-white/20 p-2 backdrop-blur-sm">
          {campaign.heroVisual === 'nabers-dashboard' ? (
            <NabersDashboardMock />
          ) : (
            <GenericHeroVisual label={`${campaign.name} · live status`} />
          )}
        </div>
      </div>
    </section>
  )
}
