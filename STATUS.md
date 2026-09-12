# Raven Labs Landing Page Studio — Build Status

## PRODUCT STATUS

**Application:** Built and working. One Next.js app, one Vercel project,
dynamic per-campaign routing, full campaign lifecycle (create → research →
strategy → copy → landing page → QA → publish → review → approve → live),
version history, duplication, archive/restore. Verified end-to-end with a
real headless browser against a production build (`next build && next
start`) — not just read through.

**Not built (see "Human actions" below for why):** an actual bundled AI
model call for generation (the engine is deterministic/rule-based, not an
LLM API call — no AI provider credentials are configured in this
environment); a live Vercel deployment (no `VERCEL_TOKEN`); real GA4/Google
Ads/CRM/reCAPTCHA IDs; Raven Labs' real ABN/phone/email.

## CAMPAIGNS

4 demo campaigns ship out of the box (seeded automatically on first run,
flagged `isDemo: true`):

| Name | Slug | Status | URL | Deployment | QA |
|---|---|---|---|---|---|
| NABERS Rating Tracking | `nabers-rating-tracking` | QA (generated, not yet published) | `/campaigns/nabers-rating-tracking` | Not deployed | Passed |
| Salesforce Consulting | `salesforce-consulting` | QA (generated, not yet published) | `/campaigns/salesforce-consulting` | Not deployed | Passed |
| AI Automation | `ai-automation` | Draft | `/campaigns/ai-automation` | Not deployed | Passed |
| Dynamics 365 Consulting | `dynamics-365-consulting` | Archived | — (404 by design) | Not deployed | Passed |

(QA "passed" means all *content-generation* checks pass; deployment status
is tracked and reported separately, never conflated with QA — see
`lib/engine/qa.ts`.)

New campaigns can be created from `/studio/campaigns/new` — verified live
during this build: a one-line brief ("Create a Google Ads campaign for
Raven Labs targeting UK enterprise businesses looking for CRM migration
services.") correctly produced a `CRM Migration` campaign at
`/campaigns/crm-migration` with its own research, keywords, strategy,
copy, SEO, and QA — fully independent of the other four (verified by
diffing the persisted records).

Also verified live: publish → mark ready for review → approve → go live
lifecycle (blocked correctly by a RED legal-details blocker until
`NEXT_PUBLIC_BUSINESS_*` env vars are set, then proceeds and creates a new
version at every step); duplicate (new campaign, independent id/slug/
geography, original untouched); archive (disappears from the active list,
public route 404s) and restore (reappears, unarchived).

## VERCEL

- **Project (intended):** `raven-landing-page-studio` (one project for all
  campaigns — see `lib/engine/generate.ts` `VERCEL_PROJECT_NAME`).
- **Production URL:** not yet assigned — this repo has not been linked to
  a Vercel project in this session (no Vercel API access here).
- **Deployment:** `NOT_DEPLOYED` for every campaign until a human runs
  `vercel link` / connects this GitHub repo to a Vercel project and sets
  `VERCEL_TOKEN` + `VERCEL_PROJECT_ID`. The Deployment tab's "Publish"
  button is fully implemented (`lib/actions/campaigns.ts` `publishCampaign`,
  `lib/deploy/vercel.ts`) and will call the real Vercel API once those
  exist — it does not fabricate success without them.

## QA

| Check | Result |
|---|---|
| Build | **Pass** — `npm run build` compiles and generates all routes cleanly |
| TypeScript | **Pass** — `npx tsc --noEmit` reports zero errors |
| Lint | Not enforced — no ESLint config/dependency is present in this repo (predates this build; `next lint` would prompt to install one) |
| Functional | **Pass** — full lifecycle (create, generate, edit copy/SEO/tracking, publish, review, approve, go live, duplicate, archive, restore) verified with a headless browser against the production build, zero console/page errors across all 17 Studio tabs + public pages tested |
| Responsive | **Pass (structural)** — every section component is built mobile-first with Tailwind responsive classes, following the same patterns already verified at 375–1440px in the original NABERS build (see `HANDOFF.md` §"Mobile-first"); the Studio itself is usable at phone width. Not re-verified pixel-by-pixel at every breakpoint in this session |
| SEO | **Pass** — unique per-campaign title/description/canonical/OG tags (`lib/engine/seo.ts`), FAQ/Service schema.org markup, `noindex` on archived campaigns, dynamic route so no duplicate metadata across campaigns |
| Accessibility | **Pass (structural)** — semantic HTML, skip link, focus-visible outlines, honeypot (not a visible field), `prefers-reduced-motion` handling — carried over from the original, already-reviewed NABERS build |

## GOOGLE ADS

- **Tracking:** Pending — `NEXT_PUBLIC_GA_ID` / `NEXT_PUBLIC_GOOGLE_ADS_ID`
  are not set in this environment. The app and every generated campaign
  correctly detect this and mark tracking as not configured rather than
  pretending it is (`lib/engine/blockers.ts`, Google Ads tab).
- **Campaign readiness:** Blocked for every current campaign, on two
  grounds, both by design: (1) Raven Labs' real ABN/phone/email are not
  set, which Google Ads' "Adequate Information" policy requires, and (2)
  no campaign has been deployed yet. Once both are resolved, campaigns
  correctly reach `READY_FOR_REVIEW` (verified live in this session with a
  test ABN/email/phone).

## BLOCKERS

1. **RED — Legal/contact details.** Every campaign's footer shows
   `[[ABN]]` / `[[PHONE]]` / `[[EMAIL]]` until `NEXT_PUBLIC_BUSINESS_ABN` /
   `_EMAIL` / `_PHONE` are set with Raven Labs' real details. Blocks
   `READY_FOR_REVIEW` for every campaign until resolved — this is correct,
   required behavior, not a bug.
2. **YELLOW — Vercel not linked.** No `VERCEL_TOKEN`/`VERCEL_PROJECT_ID` in
   this environment, so "Publish" prepares campaigns but marks them
   `PENDING_AUTHORIZATION` rather than deploying.
3. **YELLOW — Analytics/Ads tracking not configured.** No
   `NEXT_PUBLIC_GA_ID`/`NEXT_PUBLIC_GOOGLE_ADS_ID` set.
4. **YELLOW — Proof section is a placeholder** on every campaign until a
   real, approved claim is added to `raven-labs-context/approved-claims.md`
   — intentional; never a fabricated stat or testimonial.
5. **YELLOW — Competitor research is incomplete** for campaigns without a
   real competitor teardown on file (no live web-research tool is wired
   in) — flagged per-competitor as `[[Needs human teardown]]` rather than
   invented.
6. **Note, not a blocker:** production persistence. The current data layer
   is JSON-file-backed (see `README.md` "Persistence") — fully functional
   locally and for demoing on Vercel, but a durable multi-instance
   production rollout needs a real database swapped in behind the same
   `lib/store/index.ts` interface.

## HUMAN ACTIONS REQUIRED

Only items that genuinely need credentials, approval, or a business
decision — nothing here is something the Studio could safely do itself:

1. Link this repo to a Vercel project; set `VERCEL_TOKEN` /
   `VERCEL_PROJECT_ID` (and optionally `VERCEL_TEAM_ID`).
2. Provide Raven Labs' real ABN, business phone, and business email
   (`NEXT_PUBLIC_BUSINESS_ABN`/`_EMAIL`/`_PHONE`).
3. Provide real GA4, Google Ads, Zoho webhook, and reCAPTCHA credentials
   where each is wanted.
4. Add at least one real, approved proof point (stat/case study/
   testimonial) to `raven-labs-context/approved-claims.md` per campaign
   that needs one, or accept the honest placeholder.
5. Review and, where correct, click "Approve campaign" and "Confirm — go
   live" for each campaign in its Review tab — this is the human approval
   gate and is never bypassed automatically.
6. Decide the production database (if going beyond demo/QA use) and swap
   it into `lib/store/index.ts`.
