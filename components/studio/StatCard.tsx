import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function StatCard({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: number | string
  tone?: 'default' | 'warning' | 'danger' | 'success'
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
        <p
          className={cn(
            'font-display text-3xl font-bold',
            tone === 'warning' && 'text-amber-600',
            tone === 'danger' && 'text-red-600',
            tone === 'success' && 'text-emerald-600',
            tone === 'default' && 'text-foreground'
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  )
}
