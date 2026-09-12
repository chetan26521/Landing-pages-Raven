import { Gauge, LineChart, Sparkles, ShieldCheck, type LucideIcon } from 'lucide-react'

/** Maps the small, fixed icon vocabulary used in generated copy (lib/engine/copy.ts) to components. */
export const ICON_MAP: Record<string, LucideIcon> = {
  gauge: Gauge,
  'line-chart': LineChart,
  sparkles: Sparkles,
  'shield-check': ShieldCheck,
}

export function iconFor(key: string): LucideIcon {
  return ICON_MAP[key] ?? Sparkles
}
