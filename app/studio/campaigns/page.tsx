import Link from 'next/link'
import type { Metadata } from 'next'
import { listCampaigns } from '@/lib/store'
import { toSummary } from '@/lib/summary'
import CampaignCard from '@/components/studio/CampaignCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Campaign } from '@/lib/types'

export const metadata: Metadata = { title: 'Campaigns' }
export const dynamic = 'force-dynamic'

interface Query {
  q?: string
  status?: string
  service?: string
  geography?: string
  deployment?: string
  sort?: string
  archived?: string
}

export default function CampaignsManagerPage({ searchParams }: { searchParams: Query }) {
  const all = listCampaigns()
  const showArchived = searchParams.archived === '1'
  let filtered = all.filter((c) => (showArchived ? c.status === 'ARCHIVED' : c.status !== 'ARCHIVED'))

  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    filtered = filtered.filter(
      (c) => c.name.toLowerCase().includes(q) || c.service.toLowerCase().includes(q) || c.primaryKeyword.toLowerCase().includes(q)
    )
  }
  if (searchParams.status) filtered = filtered.filter((c) => c.status === searchParams.status)
  if (searchParams.service) filtered = filtered.filter((c) => c.service === searchParams.service)
  if (searchParams.geography) filtered = filtered.filter((c) => c.geography === searchParams.geography)
  if (searchParams.deployment) filtered = filtered.filter((c) => c.deployment.status === searchParams.deployment)

  filtered = sortCampaigns(filtered, searchParams.sort)

  const services = uniq(all.map((c) => c.service))
  const geographies = uniq(all.map((c) => c.geography))
  const statuses = uniq(all.map((c) => c.status))

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Campaigns</h1>
          <p className="text-muted-foreground">{filtered.length} of {all.filter((c) => (showArchived ? c.status === 'ARCHIVED' : c.status !== 'ARCHIVED')).length} shown</p>
        </div>
        <Button asChild>
          <Link href="/studio/campaigns/new">Create campaign</Link>
        </Button>
      </div>

      <form method="get" className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="lg:col-span-2">
          <Label htmlFor="q">Search</Label>
          <Input id="q" name="q" placeholder="Name, service, keyword…" defaultValue={searchParams.q ?? ''} />
        </div>
        <Field label="Status" name="status" value={searchParams.status} options={statuses} />
        <Field label="Service" name="service" value={searchParams.service} options={services} />
        <Field label="Geography" name="geography" value={searchParams.geography} options={geographies} />
        <div>
          <Label htmlFor="sort">Sort by</Label>
          <select id="sort" name="sort" defaultValue={searchParams.sort ?? 'updated'} className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <option value="updated">Last updated</option>
            <option value="created">Created</option>
            <option value="status">Status</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div className="lg:col-span-6 flex items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" name="archived" value="1" defaultChecked={showArchived} className="rounded border-input" />
            Show archived
          </label>
          <div className="flex gap-2">
            <Button type="submit" size="sm">Apply filters</Button>
            <Button asChild type="button" variant="outline" size="sm">
              <Link href="/studio/campaigns">Clear</Link>
            </Button>
          </div>
        </div>
      </form>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No campaigns match these filters.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c) => (
            <CampaignCard key={c.id} campaign={toSummary(c)} />
          ))}
        </div>
      )}
    </div>
  )
}

function Field({ label, name, value, options }: { label: string; name: string; value?: string; options: string[] }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={value ?? ''}
        className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

function uniq(list: string[]): string[] {
  return Array.from(new Set(list)).sort()
}

function sortCampaigns(list: Campaign[], sort?: string): Campaign[] {
  const copy = [...list]
  switch (sort) {
    case 'created':
      return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'status':
      return copy.sort((a, b) => a.status.localeCompare(b.status))
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return copy.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }
}
