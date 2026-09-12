# Raven Labs — Google Ads Landing Pages

One Next.js project, one route per campaign, deployed to Vercel. Built with the
`raven-landing-page-builder` skill's 7-phase workflow (research → copy → code →
tracking → QA → handoff) — see `HANDOFF.md` for the full record of the first
campaign in this repo.

## Live campaign pages

| Route | Campaign | Status |
|---|---|---|
| `/nabers-rating-tracking` | Fulqrom — Live NABERS Rating Tracking | Draft — needs human sign-off, see `HANDOFF.md` |
| `/salesforce-alternative` | Salesforce → Zoho migration (competitive conquesting) | Draft — needs human sign-off, see `HANDOFF-salesforce-alternative.md` |

Multiple campaigns run concurrently in this one project. Each has its own route,
copy, keyword and Google Ads conversion label — see "Running multiple campaigns
at once" below for how the shared pieces (thank-you page, lead form) stay
correctly separated per campaign.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in real GA4 / Google Ads / Zoho values
to test tracking and lead delivery locally (the page runs fine without them —
tracking scripts just no-op).

## Deploying

```bash
npm i -g vercel
vercel login
vercel        # first deploy, links to the Raven Labs Vercel team
vercel --prod # subsequent production deploys
```

Set the environment variables from `.env.example` in Vercel → Project → Settings →
Environment Variables (Production **and** Preview) before the first real deploy.

Full deployment steps, custom domain setup, and post-deploy verification are in
`HANDOFF.md` and in the skill's `references/vercel-deployment.md`.

## Adding the next campaign page

1. Run through Phase 1 (intake) and Phase 2 (research) again — a new keyword and
   audience means new research, not a copy-paste of this page's copy.
2. Duplicate `app/nabers-rating-tracking/` as `app/<new-campaign-slug>/page.tsx`.
3. Follow the same structure: one offer, one CTA, full footer, tracking, schema.
4. Give the page's form a hidden `<input type="hidden" name="campaign" value="<new-campaign-slug>" />`
   — `lib/submit-lead.ts` requires it, and it's how `/thanks` knows which
   conversion label to fire.
5. Add an entry for the new slug to the `CAMPAIGNS` map in `app/thanks/page.tsx`
   (its own heading, body copy, and `NEXT_PUBLIC_ADS_CONVERSION_LABEL_<SLUG>` env var name).
6. Add that new env var to `.env.example` and set the real value in Vercel once
   the human has it from Google Ads → Tools → Conversions.
7. Add the new route to the table above and write a new `HANDOFF-<slug>.md`
   (keep one handoff file traceable per campaign, don't merge them into one).

## Running multiple campaigns at once

This is supported by design, not an afterthought:
- Each campaign is an isolated route (`app/<slug>/page.tsx`) with its own copy,
  keyword, and schema — campaigns never share content.
- Shared infrastructure (brand tokens, shadcn/ui components in `components/ui/`,
  `EventTracking.tsx`, `lib/submit-lead.ts`) is reused across all campaigns, so
  each new one is faster to build than the last.
- **The one shared page, `/thanks`, is campaign-aware on purpose** — see step 4-5
  above. Every campaign's Google Ads conversion action needs its own label,
  and `?campaign=<slug>` (set automatically by `submitLead`'s redirect) is how
  the right one fires. Forgetting to add a campaign's `CAMPAIGNS` entry means
  its leads convert under the fallback label instead of their own — not a
  crash, but wrong attribution, so don't skip it.
- The Google Ads account ID (`NEXT_PUBLIC_ADS_ID`) is shared (one Ads account);
  only the conversion *label* differs per campaign.

## Per-campaign subdomains

Each campaign is reachable two ways:
- **Path, always works, no setup needed:** `https://landing-pages-raven.vercel.app/<slug>`
- **Subdomain, needs the one-time setup below:** `https://<slug>.theravenlabs.com/`

`middleware.ts` already does the code-side work — it rewrites a recognised
subdomain's root path to that campaign's route, transparently (the visitor's
URL bar stays on the subdomain; Next.js serves the campaign page underneath).
Currently mapped: `nabers-rating-tracking` and `salesforce-alternative`.

**This only works once a human does two things outside this repo — Claude Code
has no access to DNS or the Vercel dashboard to do these:**

1. **DNS** — in theravenlabs.com's DNS provider, add one CNAME record per
   campaign subdomain, pointing at Vercel:
   ```
   nabers-rating-tracking.theravenlabs.com   CNAME   cname.vercel-dns.com
   salesforce-alternative.theravenlabs.com   CNAME   cname.vercel-dns.com
   ```
2. **Vercel** — in the `landing-pages-raven` project → Settings → Domains, add
   each subdomain (`nabers-rating-tracking.theravenlabs.com`,
   `salesforce-alternative.theravenlabs.com`). Vercel verifies the CNAME and
   provisions SSL automatically once DNS propagates (usually minutes, can take
   longer).

Until both of those are done, the subdomains simply won't resolve — the
path-based URLs keep working the whole time, so nothing breaks in the
meantime. Point each campaign's Google Ads Final URL at its subdomain root
once it's confirmed live (`https://nabers-rating-tracking.theravenlabs.com/`,
not the `/nabers-rating-tracking` path) — that's what each page's canonical
URL now assumes.

**Adding a new campaign's subdomain later:** add its entry to
`SUBDOMAIN_TO_CAMPAIGN_PATH` in `middleware.ts`, then repeat the DNS + Vercel
steps above for that subdomain.
