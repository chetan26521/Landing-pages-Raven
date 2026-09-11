# Raven Labs — Google Ads Landing Pages

One Next.js project, one route per campaign, deployed to Vercel. Built with the
`raven-landing-page-builder` skill's 7-phase workflow (research → copy → code →
tracking → QA → handoff) — see `HANDOFF.md` for the full record of the first
campaign in this repo.

## Live campaign pages

| Route | Campaign | Status |
|---|---|---|
| `/nabers-rating-tracking` | Fulqrom — Live NABERS Rating Tracking | Draft — needs human sign-off, see `HANDOFF.md` |

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
4. Add the new route to the table above and to `HANDOFF.md` (or a new handoff doc
   per campaign — either is fine, just keep one traceable per launch).
