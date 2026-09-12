'use client'

import { useState } from 'react'
import { Monitor, Tablet, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const WIDTHS = { desktop: '100%', tablet: '768px', mobile: '390px' } as const

/** Master spec §21 — desktop/tablet/mobile preview, always the real campaign route (never a mock). */
export default function DevicePreview({ src }: { src: string }) {
  const [device, setDevice] = useState<keyof typeof WIDTHS>('desktop')

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-3">
        {(['desktop', 'tablet', 'mobile'] as const).map((d) => {
          const Icon = d === 'desktop' ? Monitor : d === 'tablet' ? Tablet : Smartphone
          return (
            <Button
              key={d}
              type="button"
              size="sm"
              variant={device === d ? 'default' : 'outline'}
              onClick={() => setDevice(d)}
            >
              <Icon className="w-3.5 h-3.5" /> {d[0].toUpperCase() + d.slice(1)}
            </Button>
          )
        })}
      </div>
      <div className="rounded-2xl border border-border bg-muted/30 p-4 overflow-x-auto">
        <iframe
          key={device}
          src={src}
          title="Landing page preview"
          className={cn('bg-white rounded-lg shadow-md mx-auto', device !== 'desktop' && 'border border-border')}
          style={{ width: WIDTHS[device], height: '80vh', maxWidth: '100%' }}
        />
      </div>
    </div>
  )
}
