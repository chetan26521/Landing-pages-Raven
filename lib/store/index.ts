/**
 * Campaign persistence layer.
 *
 * Production-appropriate design: business logic (lib/actions, lib/engine)
 * never touches the filesystem directly — everything goes through this
 * repository. That means swapping the backing store for a real database
 * later (Postgres, Vercel KV/Postgres, etc.) is a one-file change here,
 * with zero changes anywhere else in the app.
 *
 * Current implementation: JSON files under /data/campaigns, one file per
 * campaign, loaded into an in-memory cache on first access.
 *
 * IMPORTANT — known production limitation (documented, not hidden):
 * Vercel's serverless filesystem is read-only at runtime outside /tmp.
 * Locally (`npm run dev` / `next build && next start` on a normal server)
 * writes persist to disk across restarts. On Vercel itself, writes are
 * kept in-memory for the lifetime of the serverless instance but are NOT
 * guaranteed to persist across deployments or be shared between concurrent
 * instances. The Studio remains fully functional for demoing/QAing the
 * whole workflow, but a production rollout needs this file swapped for a
 * real database — see README.md "Persistence" section for the exact
 * migration path. This mirrors master spec §19: never fabricate readiness
 * of infrastructure that isn't actually there.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { Campaign } from '@/lib/types'

const DATA_DIR = path.join(process.cwd(), 'data', 'campaigns')
const CAN_WRITE_DISK = !process.env.VERCEL

declare global {
  // eslint-disable-next-line no-var
  var __ravenCampaignStore: Map<string, Campaign> | undefined
}

function populateFromDisk(map: Map<string, Campaign>) {
  if (!fs.existsSync(DATA_DIR)) return
  for (const file of fs.readdirSync(DATA_DIR)) {
    if (!file.endsWith('.json')) continue
    try {
      const raw = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8')
      const campaign = JSON.parse(raw) as Campaign
      map.set(campaign.id, campaign)
    } catch (err) {
      console.error(`[campaign-store] failed to load ${file}:`, err)
    }
  }
}

/**
 * First run (no persisted campaigns anywhere) — seed realistic demo data
 * (master spec §56) so the Studio isn't empty. Uses the same generation
 * engine a real campaign would use; every campaign is flagged isDemo.
 *
 * IMPORTANT: `map` must already be assigned to globalThis.__ravenCampaignStore
 * before this runs — lib/store/seed.ts calls back into slugExists()/getStore()
 * while generating (to keep slugs unique), so the store needs to already
 * resolve to this same in-progress map rather than re-entering loadFromDisk().
 */
function seedDemoData(map: Map<string, Campaign>) {
  // Lazy require avoids a static circular import at module-evaluation time
  // (seed.ts -> lib/engine/generate.ts -> lib/store -> this file); by the
  // time this function actually runs, this module has already finished
  // initializing, so require() resolves cleanly.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { buildDemoCampaigns } = require('./seed') as typeof import('./seed')
  for (const campaign of buildDemoCampaigns()) {
    map.set(campaign.id, campaign)
    if (CAN_WRITE_DISK) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true })
        fs.writeFileSync(path.join(DATA_DIR, `${campaign.id}.json`), JSON.stringify(campaign, null, 2) + '\n')
      } catch (err) {
        console.error(`[campaign-store] failed to persist seed ${campaign.id}:`, err)
      }
    }
  }
}

function getStore(): Map<string, Campaign> {
  if (!globalThis.__ravenCampaignStore) {
    const map = new Map<string, Campaign>()
    globalThis.__ravenCampaignStore = map // assigned before seeding — see seedDemoData's doc comment
    populateFromDisk(map)
    if (map.size === 0) seedDemoData(map)
  }
  return globalThis.__ravenCampaignStore
}

function persist(campaign: Campaign) {
  if (!CAN_WRITE_DISK) return
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    fs.writeFileSync(
      path.join(DATA_DIR, `${campaign.id}.json`),
      JSON.stringify(campaign, null, 2) + '\n'
    )
  } catch (err) {
    console.error(`[campaign-store] failed to persist ${campaign.id}:`, err)
  }
}

function removeFromDisk(id: string) {
  if (!CAN_WRITE_DISK) return
  try {
    const file = path.join(DATA_DIR, `${id}.json`)
    if (fs.existsSync(file)) fs.unlinkSync(file)
  } catch (err) {
    console.error(`[campaign-store] failed to remove ${id}:`, err)
  }
}

export function listCampaigns(): Campaign[] {
  return Array.from(getStore().values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function getCampaign(id: string): Campaign | undefined {
  return getStore().get(id)
}

export function getCampaignBySlug(slug: string): Campaign | undefined {
  return Array.from(getStore().values()).find((c) => c.slug === slug)
}

export function slugExists(slug: string, excludeId?: string): boolean {
  return Array.from(getStore().values()).some((c) => c.slug === slug && c.id !== excludeId)
}

export function saveCampaign(campaign: Campaign): Campaign {
  getStore().set(campaign.id, campaign)
  persist(campaign)
  return campaign
}

export function deleteCampaign(id: string): void {
  getStore().delete(id)
  removeFromDisk(id)
}

/** Read-only flag surfaced to the UI so Settings/Deployment can be honest about it. */
export const persistenceMode: 'filesystem' | 'in-memory-only' = CAN_WRITE_DISK
  ? 'filesystem'
  : 'in-memory-only'
