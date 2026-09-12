/**
 * Generic on-brand hero illustration used by any campaign that doesn't ship
 * its own (e.g. NabersDashboardMock). Pure inline SVG — no external image
 * request, never 404s. One reusable component, not one per campaign (§48).
 */
export default function GenericHeroVisual({ label = 'Live delivery status' }: { label?: string }) {
  return (
    <svg viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="generic-hero-title" className="w-full h-auto">
      <title id="generic-hero-title">{label}</title>
      <defs>
        <linearGradient id="genCardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="600" height="450" rx="24" fill="url(#genCardGrad)" />
      <rect x="0.5" y="0.5" width="599" height="449" rx="23.5" fill="none" stroke="#ffffff" strokeOpacity="0.18" />
      <circle cx="28" cy="28" r="5" fill="#ffffff" fillOpacity="0.6" />
      <circle cx="46" cy="28" r="5" fill="#ffffff" fillOpacity="0.35" />
      <circle cx="64" cy="28" r="5" fill="#ffffff" fillOpacity="0.35" />
      <text x="300" y="33" textAnchor="middle" fill="#ffffff" fillOpacity="0.7" fontFamily="Poppins, sans-serif" fontSize="13">
        {label}
      </text>
      <g transform="translate(48, 80)" fontFamily="Poppins, sans-serif">
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(0, ${i * 70})`}>
            <rect width="504" height="52" rx="12" fill="#ffffff" fillOpacity="0.09" />
            <rect x="20" y="18" width={[320, 260, 380, 220][i]} height="16" rx="8" fill="#ffffff" fillOpacity="0.35" />
            <circle cx="470" cy="26" r="10" fill="#ffffff" fillOpacity={i < 3 ? 0.9 : 0.35} />
          </g>
        ))}
      </g>
    </svg>
  )
}
