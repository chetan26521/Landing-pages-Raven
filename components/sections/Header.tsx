import { Button } from '@/components/ui/button'

export default function Header({ ctaLabel }: { ctaLabel: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="https://theravenlabs.com" target="_blank" rel="noopener" aria-label="Raven Labs home">
          {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset */}
          <img src="/logos/raven-labs-logo.png" alt="Raven Labs" width={106} height={36} />
        </a>
        <Button asChild size="sm" data-cta="header">
          <a href="#final-cta">{ctaLabel}</a>
        </Button>
      </div>
    </header>
  )
}
