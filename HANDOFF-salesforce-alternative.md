# Handoff — "Salesforce Alternative" (Salesforce → Zoho Migration) Landing Page

Campaign: **Salesforce Alternative — Competitive Conquesting**
Route: `/salesforce-alternative`
Built with: `raven-landing-page-builder` skill (7-phase workflow)
Status: **Draft — ready for human review, not launched**

---

## 1. Assumptions & Defaults

| Field | Assumed value | Reason |
|---|---|---|
| Angle | Competitive conquesting: bid on Salesforce-category search intent, pitch Raven's real Zoho Partner status as the alternative | **You chose this explicitly** — it's the only angle that doesn't risk a Google Ads misrepresentation violation, since Raven Labs holds no Salesforce credential. Company Context confirms Authorised Zoho Partner status only. |
| Primary on-page keyword | `Salesforce alternative` (in H1/title/URL) | Chosen to honestly reflect the page's actual offer. See Section 2C for why this differs from the highest-value *bid* keyword. |
| Primary bid keyword (ad group target) | `salesforce consulting` | Real AU data: 90 searches/mo, **CPC $72.66** — by far the highest commercial value keyword found. High-CPC category-term conquesting is standard PPC practice; compliant as long as the ad/page are honest about being an alternative, not a Salesforce service. |
| CTA | "Book my free CRM consultation" | You chose this. Matches the consultative, still-deciding buyer persona better than a harder "request a quote" ask. |
| Deployment | Vercel, same project as the NABERS campaign, route `/salesforce-alternative` | Matches the existing project; campaigns share infrastructure (see README "Running multiple campaigns at once"). |
| Cost comparison figures | Salesforce Enterprise ≈ $4,950/mo vs Zoho CRM Enterprise ≈ $1,200/mo, 30 users (76% saving) | **[[MUST VERIFY BEFORE LAUNCH]]** — sourced from a third-party migration-services blog (elsner.com), not fetched directly from Salesforce's or Zoho's own live AU pricing pages (both were unreachable from this session's network). SaaS list pricing changes; an inaccurate cost claim is a real Google Ads Misrepresentation risk. **A human must re-verify both prices on the vendors' current AU pricing pages before this page goes live**, and update `components/SalesforceCostCompare.tsx` if they've changed. |
| Trademark handling | Footer disclaimer: "Salesforce is a registered trademark of Salesforce, Inc. Raven Labs is not affiliated with, endorsed by, or a partner of Salesforce, Inc." | Standard practice for any competitive-conquesting page referencing a competitor's trademark by name — reduces both a Google Ads policy risk and a trademark-complaint risk. |
| Proof assets | None available — placeholders | Same gap as the NABERS page; no approved Salesforce-to-Zoho case study or testimonial was supplied. Never invented. |
| ABN / phone / email / physical address | `[[PLACEHOLDER]]` | Same unresolved blocker as the NABERS page — one fix (once Nav supplies these) will cover both pages if they're pulled into a shared config. |
| Migration timeline claim in FAQ | Flagged `[[PLACEHOLDER]]`, not asserted as fact | Research found a wide range (weeks to 6 months depending on complexity) — publishing a specific number without the delivery team's input risks setting a wrong expectation. |

---

## 2. Research Findings (Phase 2)

**A. SERP analysis** — `salesforce consulting`, Australia:
- AI Overview present.
- Top organic results: Reddit thread on AU Salesforce consultancies, Salesforce's own Consulting Partner Program page, TechForce Services (an actual Salesforce SUMMIT partner in AU), several global/US Salesforce consultancy round-ups (Singlestone, Centric, Itransition). No page in the organic top 10 pitches a *migration away from* Salesforce — the entire visible SERP assumes the searcher wants a Salesforce implementer, not an alternative.
- `zoho vs salesforce` and `salesforce alternative` SERPs are dominated by generic listicles (Agiled, IntegrateIQ, ReviewAITool) — none AU-specific, none from an actual Zoho partner.

**B. Competitor teardown** — 3 real competitors, all found via search (their pages were not directly fetchable — this session's network blocks arbitrary external sites; teardown is built from search-result summaries):

| Competitor | Angle | Notes | Gap this page exploits |
|---|---|---|---|
| **Smartmates** (AU/NZ) | Zoho Partner of the Year 4 years running (2022-2025), 60+ Zoho certifications, offers Salesforce→Zoho data migration as one service among many | Leads with award pedigree and certification count, not cost | Doesn't foreground the actual dollar gap — a buyer comparing quotes has to dig for "why switch" themselves |
| **Xponential Digital** | Explicit "Salesforce to Zoho CRM migration" service page, positions as a trusted Zoho partner | Similar to Smartmates — feature/capability-led, not cost-led | Same gap |
| **ZED Consulting** (UK, international) | Positions as "bi-platform experts" in both Salesforce and Zoho, migration + training + data-integrity guarantee | Broader/global positioning, not AU-specific | No AU data-hosting angle, no AU pricing context |

**C. Keyword clustering:**
- Primary bid keyword: `salesforce consulting` (AU vol 90/mo, CPC $72.66, competition 0.31) — highest commercial value found, navigational intent but strong buyer signal
- Primary on-page keyword: `salesforce alternative` (AU vol 10/mo, CPC ~$29) — used in H1/title/URL since it accurately describes the offer
- Supporting/LSI: `zoho vs salesforce` (vol 30, CPC $11.86), `salesforce migration` (vol ~10-70, seasonal), `crm for small business australia`, `salesforce pricing`
- Question-based (FAQ): "is zoho crm comparable to salesforce", "how much can we save switching from salesforce", "what happens to our salesforce data", "how long does migration take"

**D. Angle selection:**
> This page is the only one in the SERP that leads with the actual dollar cost gap between Salesforce and Zoho for an Australian business, using a real market-pricing benchmark, for the buyer who's still deciding whether to renew Salesforce or switch — not just executing a migration they've already committed to.

---

## 3. Copy Deck

- **Value proposition:** Raven Labs migrates you from Salesforce to Zoho CRM — the same enterprise-grade automation, hosted in Australia, for a fraction of the licensing cost.
- **Primary CTA:** "Book my free CRM consultation →" / micro-copy: "30 minutes. No obligation. Bring your current Salesforce quote."
- **H1 (message-matched):** "The Salesforce Alternative Australian Businesses Are Switching To"
- **Sub-headline:** "Raven Labs migrates you from Salesforce to Zoho CRM — the same enterprise-grade automation your team relies on, hosted in Australia, for a fraction of the licensing cost."
- **Hero visual:** Cost-comparison bar chart, Salesforce $4,950/mo vs Zoho $1,200/mo (30 users), 76% saving callout — **pending price re-verification (Section 1)**
- **Benefit bullets:** ~75% lower licensing cost (flagged) · Australian data hosting · Nothing lost in the move (data-mapped migration) · Delivered by an Authorised Zoho Partner
- **Problem headline:** "Salesforce pricing rarely stays where it started"
- **How it works:** Book free consultation → We map your Salesforce setup → We migrate and rebuild in Zoho → Your team is trained and live
- **FAQ (6):** Is Zoho comparable to Salesforce? · How much can we save? (flagged) · What happens to our data/automations? · How long does migration take? (flagged) · Do we lose functionality? · What if we're not sure yet?
- **Proof section:** entirely placeholder — no real stat/testimonial available
- **Footer:** Company links, Privacy/T&Cs, `[[ABN]]`/`[[PHONE]]`/`[[EMAIL]]` placeholders, **plus a Salesforce trademark disclaimer**

**Suggested Google Ad draft** (for review — does not exist in Google Ads yet):

| Field | Draft copy |
|---|---|
| Headline 1 | Salesforce Alternative for Aussie Businesses |
| Headline 2 | Same CRM Power, ~75% Lower Cost |
| Headline 3 | Free CRM Consultation |
| Description 1 | Comparing Salesforce quotes? See what Zoho CRM can do instead — enterprise automation, Australian data hosting, migrated by an Authorised Zoho Partner. |
| Description 2 | Book a free 30-minute CRM consultation. Bring your current Salesforce quote. |
| Final URL | `https://salesforce-alternative.theravenlabs.com/?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_term={keyword}&utm_content={_adgroup}_{creative}&gclid={gclid}` — requires the subdomain DNS/Vercel setup in README.md "Per-campaign subdomains"; until that's done, use `https://landing-pages-raven.vercel.app/salesforce-alternative?...` instead |

**Ad-to-page message match audit:**

| Element | Ad | Page | Match? |
|---|---|---|---|
| Primary offer | Salesforce alternative via Zoho | H1: "The Salesforce Alternative..." | ✅ |
| CTA verb | "Book a free consultation" | "Book my free CRM consultation" | ✅ |
| Keyword | Salesforce (alternative) | In H1, title, URL, body | ✅ |
| Cost claim | "~75% lower cost" | Same figure in hero visual + benefits (pending re-verification) | ✅ (once verified) |

**Compliance note:** this campaign bids on a competitor-category term (`salesforce consulting`) while offering an alternative — legitimate conquesting, but the ad and page must never imply Raven Labs is a Salesforce partner, consultant, or affiliate. The footer trademark disclaimer and the careful "alternative" framing throughout are there specifically to keep this compliant. Don't loosen this wording without re-checking against `references/google-ads-compliance.md`.

---

## 4. Code Files

```
app/salesforce-alternative/page.tsx    The landing page (all 8 anatomy sections, shadcn/ui)
components/SalesforceCostCompare.tsx   Inline SVG cost-comparison hero visual (pending price re-verification)
```

**Shared infrastructure changed to support multiple concurrent campaigns:**
```
lib/submit-lead.ts       Now requires a `campaign` field on every form (used to route conversions)
app/thanks/page.tsx      Now reads ?campaign=<slug> to show the right copy + fire the right Ads
                         conversion label (CAMPAIGNS map — add an entry here for every new campaign)
app/nabers-rating-tracking/page.tsx
                         Updated with the required hidden campaign="nabers-rating-tracking" field
                         (regression-tested — still submits and converts correctly, see Section 7)
.env.example             Updated: one NEXT_PUBLIC_ADS_CONVERSION_LABEL_<SLUG> per campaign
README.md                Updated: multi-campaign pattern documented
```

**Not yet done — flagged, not silently skipped:**
- Cost comparison figures need re-verification against live Salesforce/Zoho AU pricing (Section 1) — **this is the single most important pre-launch item on this page**
- `public/og-image-salesforce-alternative.png` — social share image not yet created
- Migration timeline in FAQ needs a real number from the delivery team

---

## 5. Deployment Instructions (Vercel)

Same project as the NABERS page — no new Vercel project needed.

1. `npm install && npm run build` to confirm a clean build (already verified in this session).
2. Push this branch and merge to `main` (or your team's production branch) — Vercel auto-deploys from there.
3. Add the new env var to Vercel → Project → Settings → Environment Variables (Production **and** Preview):
   `NEXT_PUBLIC_ADS_CONVERSION_LABEL_SALESFORCE_ALTERNATIVE`
4. No new domain/subdomain needed unless you want `salesforce-alternative.theravenlabs.com` — the page is reachable at `<your-domain>/salesforce-alternative` on the existing project.

---

## 6. Google Ads Hookup Block

- [ ] Create the campaign/ad group and the ad using the draft in Section 3 (or your revised version)
- [ ] Set **Final URL** to `https://salesforce-alternative.theravenlabs.com/` (once the subdomain is live — see README.md "Per-campaign subdomains") with the UTM template above
- [ ] Set up a **separate Conversion Action** in Google Ads for this campaign's form submission (do not reuse the NABERS campaign's conversion action)
- [ ] Copy the resulting conversion label into `NEXT_PUBLIC_ADS_CONVERSION_LABEL_SALESFORCE_ALTERNATIVE` in Vercel
- [ ] Confirm the ad's headline matches the page H1 (message-match audit above)
- [ ] Add the page URL to Google Search Console
- [ ] Add the page as a conversion event destination in GA4
- [ ] Bid keyword strategy: phrase-match `salesforce consulting`, `salesforce alternative`, `zoho vs salesforce` — consider excluding `salesforce careers`, `salesforce jobs`, `salesforce login`, `salesforce trailhead` as negatives (informational/navigational, won't convert)
- [ ] Location targeting: Australia (national)
- [ ] **Legal/trademark check**: have someone (ideally with input from whoever handles Raven's legal/compliance) sign off on referencing "Salesforce" by name in ad copy — this is standard competitive-conquesting practice but some legal teams want to review it first

---

## 7. QA Checklist

✅ = done, ⚠️ = done but flagged for human confirmation, ❌ = blocks launch until fixed.

**Message match:** ✅ H1 has primary on-page keyword ("Salesforce alternative") · ✅ H1 echoes the draft ad's promise · ✅ CTA verb matches · ✅ URL slug (`/salesforce-alternative`) has keyword · ✅ Title <60 chars · ✅ Meta description has keyword+CTA

**Copy quality:** ⚠️ Cost claim needs re-verification (❌ blocks launch — see Section 1) · ✅ Zero anonymous testimonials shipped (placeholders only) · ✅ Australian English · ✅ "Zoho" and "Raven Labs" capitalised correctly · ✅ No unsupported superlatives · ✅ Salesforce trademark disclaimer present

**Visual design:** ✅ Brand colours/fonts via shared shadcn/ui theme (consistent with the NABERS page) · ✅ Real logo in use (same asset, header + footer chip) · ✅ WCAG-considered contrast · ✅ Cost-comparison visual uses neutral grey for Salesforce's bar (not Salesforce's own brand blue) to avoid implying endorsement · ✅ No carousels/auto-playing video

**Mobile-first:** ✅ Verified with a real headless-browser pass at 375/390/768/1440px — `scrollWidth === clientWidth` at all four, zero console/page errors

**Legal & Ads compliance:** ❌ ABN/phone/email missing (same blocker as NABERS page) · ✅ Privacy/Terms links present · ✅ Trademark disclaimer present · ⚠️ Cost claim compliance depends on price re-verification · ✅ No claims of Salesforce partnership/affiliation anywhere on the page

**Tracking:** ✅ GA4 snippet (shared layout) · ✅ Google Ads conversion snippet, campaign-specific label via `/thanks?campaign=salesforce-alternative` · ✅ `generate_lead` fires on `/thanks` · ✅ `cta_click`/`scroll_75`/`engaged_session`/`form_start` wired (shared `EventTracking.tsx`) · ✅ UTM+gclid capture

**Multi-campaign regression:** ✅ Confirmed the NABERS page's form still submits correctly and lands on `/thanks?campaign=nabers-rating-tracking` after this change — no cross-campaign breakage

**Form:** ✅ 4 required fields · ✅ Honeypot · ⚠️ reCAPTCHA needs a real site key to activate · ✅ Distinct `/thanks` route (shared, campaign-aware)

**Overall: NOT READY TO LAUNCH.** One new hard blocker specific to this page — **the cost-comparison figures must be re-verified against live vendor pricing** before this goes anywhere near ad spend, since an inaccurate cost claim is both a compliance risk and a trust risk if a prospect checks it themselves. Plus the carried-over ABN/phone/email blocker shared with the NABERS page, and a real proof point recommended. Everything else — code, tracking, compliance footer, multi-campaign wiring — is built and verified.

---

## 8. Post-Launch Monitoring Plan

Same cadence as the NABERS page (see its HANDOFF.md Section 8) — 24h/7d/30d checks on conversions, tracking, and CPL. One addition specific to this campaign: **watch for any comment/complaint about the Salesforce comparison** (from a prospect, or from Salesforce itself) in the first 7 days — competitive-conquesting pages occasionally draw a cease-and-desist or a platform complaint even when factually accurate; have the trademark disclaimer and pricing sources ready to reference if that happens.
