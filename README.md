# Raven Labs Landing Page Studio

A multi-campaign landing page management and generation platform for Raven
Labs. One Next.js app, one Vercel project, any number of Google Ads
campaigns — each with its own research, strategy, copy, landing page, SEO,
tracking, deployment status, and version history.

```
RAVEN LABS LANDING PAGE STUDIO
├── /studio                          internal app (dashboard, campaign manager, workspace)
└── /campaigns/{slug}                public, dynamically-rendered landing pages
```

## What it does

- Create a campaign from a one-line brief or a structured form.
- Runs research → keyword strategy → competitor notes → strategy → copy →
  page structure → SEO → Google Ads readiness → QA automatically.
- Renders every campaign's landing page through the **same** dynamic route
  and reusable section components — never a bespoke file per campaign.
- Tracks campaign lifecycle (`DRAFT` → … → `LIVE`), version history,
  duplication, archiving/restoring.
- Never launches paid advertising or fabricates a deployment on its own —
  every irreversible step needs an explicit human click (see "Human
  approval gate" below).

## Architecture

```
lib/types.ts            Campaign data model (single source of truth)
lib/store/               Persistence layer (JSON-file repository + demo seed)
lib/engine/               Generation engine (research, keywords, competitors,
                          strategy, copy, page structure, SEO, Google Ads
                          readiness, QA, blockers)
lib/actions/campaigns.ts  Server actions — the one place that mutates campaigns
lib/deploy/vercel.ts      Vercel deployment trigger (used only when credentials exist)
raven-labs-context/       Raven Labs brand/positioning/voice source of truth
components/sections/      Reusable landing-page design system (Hero, Problem,
                          Benefits, Proof, HowItWorks, Faq, FinalCta, …) +
                          LandingPage.tsx, the one renderer both the public
                          route and the Studio's live preview use
components/studio/         Studio-only UI (dashboard cards, tabs, badges)
app/campaigns/[slug]/      The ONE public route every campaign renders through
app/studio/                 Dashboard, campaign manager, campaign workspace (tabs)
```

### Why this is not "one file per campaign"

`app/campaigns/[slug]/page.tsx` looks up a `Campaign` record by slug and
renders it through `components/sections/LandingPage.tsx`, which composes a
fixed set of section components in whatever order the campaign's generated
`PageStructure` specifies. Adding a campaign never adds a source file —
only a data record. This is the same principle behind the design system
(`raven-labs-context/design-system.md`).

## Local setup

```bash
npm install
cp .env.example .env.local   # optional — every var is optional, see below
npm run dev
```

Open `http://localhost:3000/studio`. On first run, since there's no
persisted campaign data yet, the Studio seeds four realistic demo campaigns
(flagged `isDemo: true`) — see "Demo data" below.

## Environment variables

Every variable in `.env.example` is optional — the Studio is fully
functional with none of them set. They gate specific capabilities:

| Variable | Gates |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Base URL used to build public campaign URLs |
| `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GTM_ID` | GA4 / GTM loading in the root layout |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` / `_CONVERSION_LABEL` | Ads conversion firing on `/campaigns/[slug]/thanks` |
| `NEXT_PUBLIC_BUSINESS_ABN` / `_EMAIL` / `_PHONE` | Real legal/contact details in the footer — **required by Google Ads' "Adequate Information" policy**; absent, every campaign carries a RED blocker and can never reach `READY_FOR_REVIEW` |
| `ZOHO_WEBHOOK_URL` | Whether submitted leads are forwarded to a CRM |
| `RECAPTCHA_SECRET` / `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Spam-check enforcement on lead forms |
| `VERCEL_TOKEN` / `VERCEL_PROJECT_ID` / `VERCEL_TEAM_ID` | Whether "Publish" in the Deployment tab actually calls the Vercel API, or prepares the campaign and marks it `PENDING_AUTHORIZATION` |

Campaign-level tracking IDs (Google Ads tab → Tracking configuration)
override these app-wide defaults per campaign.

## Data layer / persistence

`lib/store/index.ts` is a small repository (`listCampaigns`,
`getCampaignBySlug`, `saveCampaign`, …) backed by one JSON file per campaign
under `/data/campaigns`. All business logic goes through this file — no
other module touches the filesystem — so swapping the backing store for a
real database is a one-file change.

**Known, documented limitation:** Vercel's serverless filesystem is
read-only at runtime outside `/tmp`. Locally (`next dev`, or `next start`
on a normal server) writes persist to disk across restarts. On Vercel
itself, campaign data lives in-memory for the life of a serverless
instance but is not guaranteed to persist across deployments or be shared
between concurrent instances. The Studio is fully functional for
demoing/QAing the whole workflow on Vercel, but a real production rollout
needs `lib/store/index.ts` swapped for a real database (Vercel
Postgres/KV, Supabase, etc.) behind the same function signatures — nothing
else in the app needs to change.

## Campaign routing

- Public: `app/campaigns/[slug]/page.tsx` — fully dynamic (`export const
  dynamic = 'force-dynamic'`), because campaign data is live, editable app
  state, not static content. An unknown or archived slug 404s.
- Internal: `app/studio/campaigns/[slug]/…` — the campaign workspace,
  organised as tabs (Overview, Research, Keywords, Competitors, Copy,
  Landing Page, SEO, Google Ads, Deployment, Versions, Review, Settings).

Slugs are generated from the campaign name (`lib/slug.ts`), URL-safe, and
never silently reused — a collision gets an incrementing suffix.

## Landing page generation

`lib/engine/generate.ts` runs, in order: research → keywords → competitors
→ strategy (which narrative arc: problem-solution-proof /
pain-automation-roi / risk-expertise-assurance) → copy → page structure →
SEO → Google Ads readiness → QA → blockers. It's a deterministic,
inspectable, rule-based pipeline — **not** a call to an external LLM API,
since this Studio ships with no bundled AI provider credentials. Every
"AI understands campaign" step in the brief is implemented as transparent
logic composing the campaign's own fields with the Raven Labs context
files in `raven-labs-context/`.

**To wire in a real LLM later:** each `lib/engine/*.ts` file exports one
function with a narrow, typed signature (e.g. `generateCopy(campaign):
CampaignCopy`). Swap the body for a call to Claude (or any model) that
returns the same shape — nothing upstream or downstream needs to change.

Two things the engine deliberately never fabricates:
- **Proof/case-study content** — until a human adds a real, approved claim
  to `raven-labs-context/approved-claims.md`, the Proof section ships as an
  honest placeholder, flagged as a YELLOW blocker, not a QA failure.
- **Competitor teardowns** — without a live web-research tool, competitor
  URLs are recorded but their messaging/positioning are marked `[[Needs
  human teardown]]` rather than invented.

## Vercel deployment

All campaigns deploy through **one** Vercel project — there is no
per-campaign deployment. "Publish" in a campaign's Deployment tab:

1. Validates the campaign (QA must pass).
2. If `VERCEL_TOKEN`/`VERCEL_PROJECT_ID` are set, calls the Vercel REST API
   (`lib/deploy/vercel.ts`) to trigger a production deployment of this same
   project.
3. If they aren't set, marks the campaign `PENDING_AUTHORIZATION` and logs
   exactly what's missing — it never fabricates a successful deployment.
4. Either way, the campaign's route (`/campaigns/{slug}`) is already live
   inside this one running app the moment the campaign is saved — what
   "Publish" adds is Vercel's own production build/promotion step.

## Google Ads tracking setup

1. Set `NEXT_PUBLIC_GA_ID` and create a GA4 conversion event for
   `generate_lead`.
2. Create a Google Ads Conversion Action for form submission; set
   `NEXT_PUBLIC_GOOGLE_ADS_ID` / `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`
   (or per-campaign, in the Google Ads tab).
3. Point the ad's Final URL at `/campaigns/{slug}` with your UTM template;
   `gclid`/UTM params are captured client-side (`components/EventTracking.tsx`)
   into hidden form fields and forwarded with the lead.
4. Events fired: `page_view`, `cta_click`, `form_start`, `scroll_75`,
   `engaged_session`, plus `conversion`/`generate_lead` on the thanks page.

## Campaign lifecycle & the human approval gate

```
DRAFT → RESEARCHING → STRATEGY_READY → BUILDING → QA → (DEPLOYING) →
DEPLOYED → READY_FOR_REVIEW → APPROVED → LIVE
```

`PAUSED`, `ARCHIVED`, and `ERROR` can interrupt this at any point. The
Studio never advances a campaign past `READY_FOR_REVIEW` automatically —
every transition from there (`READY_FOR_REVIEW → APPROVED → LIVE`)
requires an explicit action from the Review tab, by a signed-in team
member. `DEPLOYED` (the page is publicly reachable) and `LIVE` (paid
advertising is actually running) are always kept distinct.

## Versioning

Every publish, regeneration, restore, or approval creates a new version
(`lib/versioning.ts`) with a snapshot of strategy/copy/page structure/SEO.
Restoring an old version creates version N+1 rather than destroying
history — the Versions tab shows the full trail.

## Raven Labs context

`raven-labs-context/*.md` is the source of truth for brand, positioning,
services, ICP, personas, tone of voice, approved claims, case studies,
testimonials, CTA guidelines, and the design system. The generation engine
composes campaign-specific data with this context rather than inventing
company facts. To add a new service line, persona, or approved claim, edit
the relevant file — no code change required for the engine to pick it up
as background context (the actual angle/arc mapping used at runtime lives
in `lib/engine/strategy.ts`, kept in code so it stays type-checked).

## Demo data

Four illustrative campaigns seed automatically the first time the campaign
store is empty (`lib/store/seed.ts`), flagged `isDemo: true`:

- **NABERS Rating Tracking** — carries over the real, human-reviewed
  research and copy from this repo's original single-page build.
- **Salesforce Consulting** — a US-targeted example, further along its
  lifecycle (QA passed, deployment prepared).
- **AI Automation** — left as an early `DRAFT`.
- **Dynamics 365 Consulting** — `ARCHIVED`, to demonstrate the
  archive/restore flow.

None of these carry fabricated client claims, testimonials, or stats —
where none exist, the Proof section ships as an honest placeholder.

## Adding a new reusable landing page component

1. Add the component under `components/sections/`, typed as `{ campaign:
   Campaign }` like its siblings.
2. Add its key to the `SectionType` union in `lib/types.ts`.
3. Register it in `SECTION_COMPONENTS` in
   `components/sections/LandingPage.tsx`.
4. Teach `lib/engine/structure.ts` when to include it.

## Troubleshooting deployment

- **"Publish" doesn't actually deploy anything visible on Vercel** — check
  `VERCEL_TOKEN`/`VERCEL_PROJECT_ID` are set; without them the Deployment
  tab intentionally shows `PENDING_AUTHORIZATION`, not a fake success.
- **A campaign 404s at `/campaigns/{slug}`** — the campaign is `ARCHIVED`,
  or the slug doesn't exist. Check the Studio's Campaigns list (include
  archived) for the real slug.
- **Campaign edits don't seem to persist after a Vercel redeploy** — see
  "Data layer / persistence" above; this needs a real database in
  production.

## QA

- `npm run build` runs the production TypeScript + build check for the
  whole app (this is the "Technical: build/TypeScript" QA gate).
- Each campaign's own QA (Content tab feedback, Overview tab blockers) is
  computed by `lib/engine/qa.ts` + `lib/engine/blockers.ts` — content
  placeholders, SEO field lengths, form/tracking configuration, and
  (informationally) deployment status.
