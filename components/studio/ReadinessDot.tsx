import { cn } from '@/lib/utils'
import type { ReadinessLevel } from '@/lib/types'

const STYLES: Record<ReadinessLevel, string> = {
  GREEN: 'bg-emerald-500',
  YELLOW: 'bg-amber-500',
  RED: 'bg-red-500',
}

export default function ReadinessDot({ level, className }: { level: ReadinessLevel; className?: string }) {
  return <span className={cn('inline-block w-2.5 h-2.5 rounded-full', STYLES[level], className)} aria-hidden="true" />
}
