'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'
import Modal from './Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { duplicateCampaignAction } from '@/lib/actions/campaigns'

export default function DuplicateCampaignButton({
  campaignId,
  campaignName,
  geography,
}: {
  campaignId: string
  campaignName: string
  geography: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Copy className="w-3.5 h-3.5" /> Duplicate
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={`Duplicate "${campaignName}"`}>
        <form
          action={async (formData: FormData) => {
            await duplicateCampaignAction(campaignId, {
              name: String(formData.get('name') || ''),
              geography: String(formData.get('geography') || '') || undefined,
            })
          }}
          className="grid gap-4"
        >
          <p className="text-sm text-muted-foreground">
            Inherits strategy, page structure, and copy framework. Geography, keywords, audience, and
            everything else stay independently editable — duplicates never share mutable data (§24/§52).
          </p>
          <div>
            <Label htmlFor="dup-name">New campaign name</Label>
            <Input id="dup-name" name="name" required defaultValue={`${campaignName} — Copy`} />
          </div>
          <div>
            <Label htmlFor="dup-geo">Geography (optional override)</Label>
            <Input id="dup-geo" name="geography" defaultValue={geography} />
          </div>
          <Button type="submit">Create duplicate</Button>
        </form>
      </Modal>
    </>
  )
}
