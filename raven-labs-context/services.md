# Raven Labs — Services

These are the service lines a campaign's `service` field should map onto.
The generation engine (`lib/engine/strategy.ts`) uses this list to pick a
sensible narrative arc and default positioning when a campaign doesn't
specify its own.

- **CRM consulting & implementation** — Salesforce, Zoho, Dynamics 365,
  HubSpot. Angle: expertise + process + assurance (implementations are
  risky; Raven Labs de-risks them).
- **CRM migration** — moving from one CRM (or spreadsheets) to another.
  Angle: migration risk → expertise → process → assurance.
- **AI automation / workflow automation** — connecting systems, removing
  manual work. Angle: pain → automation opportunity → ROI → process.
- **Fulqrom (NABERS rating tracking software)** — continuous energy
  rating tracking for commercial buildings. Angle: problem (annual
  guesswork) → solution (live software) → proof → CTA.
- **Custom software development** — bespoke internal tools and
  integrations. Angle: problem → solution → services → proof.

New services can be added here without touching code — the engine reads
this file as background context only; the actual angle mapping used at
runtime lives in `lib/engine/strategy.ts` (kept in code so it stays
type-checked and testable), and should be kept in sync with this list.
