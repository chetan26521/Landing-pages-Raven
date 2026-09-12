/**
 * Inline SVG cost-comparison visual for the hero — Salesforce Enterprise vs
 * Zoho CRM Enterprise, 30 users, monthly. Real published list pricing (see
 * HANDOFF for source), not an invented number. Salesforce's bar uses a
 * neutral grey, not Salesforce's own brand blue, to avoid implying any
 * affiliation with or endorsement by Salesforce.
 */
export default function SalesforceCostCompare() {
  // Salesforce Sales Cloud Enterprise ~$4,950/mo, Zoho CRM Enterprise ~$1,200/mo,
  // both for 30 users, per published list pricing at time of writing.
  const salesforce = 4950
  const zoho = 1200
  const maxWidth = 380
  const salesforceWidth = maxWidth
  const zohoWidth = Math.round((zoho / salesforce) * maxWidth)
  const savingsPct = Math.round((1 - zoho / salesforce) * 100)

  return (
    <svg
      viewBox="0 0 460 260"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="cost-title cost-desc"
      className="w-full h-auto"
    >
      <title id="cost-title">Monthly CRM licensing cost comparison, 30 users</title>
      <desc id="cost-desc">
        Salesforce Sales Cloud Enterprise costs approximately $4,950 AUD per month for 30 users.
        Zoho CRM Enterprise costs approximately $1,200 AUD per month for the same 30 users — a 76%
        reduction. Based on published list pricing.
      </desc>

      <rect width="460" height="260" rx="24" fill="#ffffff" fillOpacity="0.08" />
      <rect x="0.5" y="0.5" width="459" height="259" rx="23.5" fill="none" stroke="#ffffff" strokeOpacity="0.18" />

      <text x="24" y="34" fill="#ffffff" fillOpacity="0.8" fontFamily="Poppins, sans-serif" fontSize="13">
        Monthly licensing · 30 users
      </text>

      {/* Salesforce bar */}
      <g transform="translate(24, 60)">
        <text y="-8" fill="#ffffff" fillOpacity="0.85" fontFamily="Poppins, sans-serif" fontSize="13">
          Salesforce Enterprise
        </text>
        <rect width={salesforceWidth} height="28" rx="8" fill="#ffffff" fillOpacity="0.25" />
        <text x={salesforceWidth - 10} y="19" textAnchor="end" fill="#ffffff" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="14">
          ${salesforce.toLocaleString()}/mo
        </text>
      </g>

      {/* Zoho bar */}
      <g transform="translate(24, 130)">
        <text y="-8" fill="#ffffff" fillOpacity="0.85" fontFamily="Poppins, sans-serif" fontSize="13">
          Zoho CRM Enterprise (via Raven Labs)
        </text>
        <rect width={zohoWidth} height="28" rx="8" fill="#ffffff" />
        <text x={zohoWidth - 10} y="19" textAnchor="end" fill="#4a00e1" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="14">
          ${zoho.toLocaleString()}/mo
        </text>
      </g>

      {/* Savings callout */}
      <g transform="translate(24, 190)">
        <rect width="130" height="48" rx="12" fill="#ffffff" fillOpacity="0.15" />
        <text x="16" y="20" fill="#ffffff" fillOpacity="0.8" fontFamily="Poppins, sans-serif" fontSize="11">
          Estimated saving
        </text>
        <text x="16" y="40" fill="#ffffff" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="22">
          {savingsPct}%
        </text>
      </g>

      <text x="24" y="252" fill="#ffffff" fillOpacity="0.6" fontFamily="Poppins, sans-serif" fontSize="10">
        Published list pricing, AUD. Your actual cost depends on edition and add-ons.
      </text>
    </svg>
  )
}
