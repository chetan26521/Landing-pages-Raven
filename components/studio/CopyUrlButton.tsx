'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        } catch {
          // Clipboard API unavailable (e.g. insecure context) — no-op, button stays inert.
        }
      }}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy URL'}
    </Button>
  )
}
