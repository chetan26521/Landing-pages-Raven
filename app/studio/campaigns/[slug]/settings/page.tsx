import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateCampaignSettings, pauseCampaign, resumeCampaign } from '@/lib/actions/campaigns'
import DuplicateCampaignButton from '@/components/studio/DuplicateCampaignButton'
import ArchiveRestoreButton from '@/components/studio/ArchiveRestoreButton'

export const metadata: Metadata = { title: 'Settings' }
export const dynamic = 'force-dynamic'

export default function SettingsPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)

  async function save(formData: FormData) {
    'use server'
    await updateCampaignSettings(campaign.id, {
      name: String(formData.get('name') || campaign.name),
      service: String(formData.get('service') || campaign.service),
      audience: String(formData.get('audience') || campaign.audience),
      industry: String(formData.get('industry') || '') || undefined,
      geography: String(formData.get('geography') || campaign.geography),
      objective: String(formData.get('objective') || campaign.objective),
      primaryCTA: String(formData.get('primaryCTA') || campaign.primaryCTA),
      secondaryCTA: String(formData.get('secondaryCTA') || '') || undefined,
      offer: String(formData.get('offer') || '') || undefined,
    })
  }

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4">Campaign metadata</h3>
          <form action={save} className="grid sm:grid-cols-2 gap-4">
            <Field label="Name" name="name" defaultValue={campaign.name} />
            <Field label="Service" name="service" defaultValue={campaign.service} />
            <Field label="Audience" name="audience" defaultValue={campaign.audience} />
            <Field label="Industry" name="industry" defaultValue={campaign.industry} />
            <Field label="Geography" name="geography" defaultValue={campaign.geography} />
            <Field label="Objective" name="objective" defaultValue={campaign.objective} />
            <Field label="Primary CTA" name="primaryCTA" defaultValue={campaign.primaryCTA} />
            <Field label="Secondary CTA" name="secondaryCTA" defaultValue={campaign.secondaryCTA} />
            <Field label="Offer" name="offer" defaultValue={campaign.offer} />
            <div className="sm:col-span-2">
              <Button type="submit">Save settings</Button>
            </div>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            Note: the campaign slug (<code className="font-mono">{campaign.slug}</code>) and public URL never
            change here — routes are stable (§42). Rename by duplicating instead if you need a new URL.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-display font-semibold">Lifecycle</h3>
            <div className="flex flex-col gap-2">
              <DuplicateCampaignButton campaignId={campaign.id} campaignName={campaign.name} geography={campaign.geography} />
              {campaign.status === 'PAUSED' ? (
                <form action={resumeCampaign.bind(null, campaign.id)}>
                  <Button type="submit" variant="outline" size="sm" className="w-full">Resume</Button>
                </form>
              ) : (
                campaign.status !== 'ARCHIVED' && (
                  <form action={pauseCampaign.bind(null, campaign.id)}>
                    <Button type="submit" variant="outline" size="sm" className="w-full">Pause</Button>
                  </form>
                )
              )}
              <ArchiveRestoreButton campaignId={campaign.id} archived={campaign.status === 'ARCHIVED'} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-xs text-muted-foreground space-y-2">
            <p><strong>Created:</strong> {new Date(campaign.createdAt).toLocaleString('en-AU')}</p>
            <p><strong>Updated:</strong> {new Date(campaign.updatedAt).toLocaleString('en-AU')}</p>
            {campaign.approvedAt && <p><strong>Approved:</strong> {new Date(campaign.approvedAt).toLocaleString('en-AU')}</p>}
            {campaign.publishedAt && <p><strong>Live since:</strong> {new Date(campaign.publishedAt).toLocaleString('en-AU')}</p>}
            <p><strong>Campaign ID:</strong> <span className="font-mono">{campaign.id}</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue} />
    </div>
  )
}
