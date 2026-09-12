'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const TABS: { href: string; label: string }[] = [
  { href: '', label: 'Overview' },
  { href: '/research', label: 'Research' },
  { href: '/keywords', label: 'Keywords' },
  { href: '/competitors', label: 'Competitors' },
  { href: '/copy', label: 'Copy' },
  { href: '/landing-page', label: 'Landing Page' },
  { href: '/seo', label: 'SEO' },
  { href: '/google-ads', label: 'Google Ads' },
  { href: '/deployment', label: 'Deployment' },
  { href: '/versions', label: 'Versions' },
  { href: '/review', label: 'Review' },
  { href: '/settings', label: 'Settings' },
]

export default function WorkspaceTabs({ slug }: { slug: string }) {
  const pathname = usePathname()
  const base = `/studio/campaigns/${slug}`

  return (
    <nav className="overflow-x-auto -mb-px">
      <ul className="flex gap-1 min-w-max px-1">
        {TABS.map((tab) => {
          const href = `${base}${tab.href}`
          const active = pathname === href
          return (
            <li key={tab.href}>
              <Link
                href={href}
                className={cn(
                  'inline-flex items-center px-3.5 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                  active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
