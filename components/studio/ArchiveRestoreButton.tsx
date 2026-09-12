'use client'

import { useTransition } from 'react'
import { Archive, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { archiveCampaign, restoreCampaign } from '@/lib/actions/campaigns'

export default function ArchiveRestoreButton({ campaignId, archived }: { campaignId: string; archived: boolean }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (archived) {
          startTransition(() => restoreCampaign(campaignId))
          return
        }
        if (window.confirm('Archive this campaign? It will disappear from active views but stay fully recoverable.')) {
          startTransition(() => archiveCampaign(campaignId))
        }
      }}
    >
      {archived ? (
        <>
          <RotateCcw className="w-3.5 h-3.5" /> Restore
        </>
      ) : (
        <>
          <Archive className="w-3.5 h-3.5" /> Archive
        </>
      )}
    </Button>
  )
}
