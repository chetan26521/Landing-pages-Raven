import Link from 'next/link'
import { Plus, LayoutGrid, Rows3 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 bg-white border-b border-border">
        <div className="container mx-auto flex items-center justify-between py-3.5 gap-4">
          <Link href="/studio" className="flex items-center gap-2.5 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset */}
            <img src="/logos/raven-labs-logo.png" alt="Raven Labs" width={92} height={32} />
            <span className="hidden sm:block h-5 w-px bg-border" aria-hidden="true" />
            <span className="hidden sm:block font-display font-semibold text-sm text-muted-foreground truncate">
              Landing Page Studio
            </span>
          </Link>
          <nav className="flex items-center gap-1.5">
            <Button asChild variant="ghost" size="sm">
              <Link href="/studio">
                <LayoutGrid className="w-4 h-4" /> Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/studio/campaigns">
                <Rows3 className="w-4 h-4" /> Campaigns
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/studio/campaigns/new">
                <Plus className="w-4 h-4" /> New Campaign
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
