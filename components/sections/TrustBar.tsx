import { Badge } from '@/components/ui/badge'
import type { Campaign } from '@/lib/types'

export default function TrustBar({ campaign }: { campaign: Campaign }) {
  return (
    <div className="bg-white py-6 border-b border-border">
      <div className="container mx-auto">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Built by Raven Labs
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge variant="secondary">{campaign.geography} · National delivery</Badge>
          <Badge variant="secondary">{campaign.service}</Badge>
          <Badge variant="secondary">Melbourne HQ</Badge>
          {/* Real, permitted client logos only go here once approved — never fabricated (§11). */}
        </div>
      </div>
    </div>
  )
}
