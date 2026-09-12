# Raven Labs — Landing Page Design System

Implemented in `components/sections/*` and themed via `app/globals.css` +
`tailwind.config.ts`. Every campaign composes the same section
*components* in a campaign-specific order/config (`PageStructure`) — see
master spec §48: never one source file per campaign.

## Reusable sections
`Header`, `Hero`, `TrustBar`, `Problem`, `Benefits`, `Proof`,
`HowItWorks`, `Faq`, `FinalCta`, `Footer` — each takes typed props built
from a `Campaign`'s `copy`/`seo`/`tracking` fields, never hard-coded
content.

## Narrative arcs (§16)
- `problem-solution-proof` — Problem → Benefits → Proof → How it works → FAQ → CTA
- `pain-automation-roi` — Problem (framed as pain) → Benefits (framed as automation/ROI) → How it works → Proof → FAQ → CTA
- `risk-expertise-assurance` — Problem (framed as risk) → How it works (framed as process) → Benefits (framed as expertise) → Proof (framed as assurance) → FAQ → CTA

The engine (`lib/engine/structure.ts`) picks the arc from the campaign's
strategy and reorders/relabels sections accordingly — same components,
different composition.
