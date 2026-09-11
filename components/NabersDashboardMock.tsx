/**
 * Inline SVG "dashboard mockup" for the hero — a real on-brand visual
 * (star rating gauge + live trend line + mini metric cards) instead of a
 * generic stock photo or a broken image reference. Renders inline, so
 * it never 404s and never needs an external asset file.
 */
export default function NabersDashboardMock() {
  return (
    <svg
      viewBox="0 0 600 450"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="dashboard-title dashboard-desc"
      className="w-full h-auto"
    >
      <title id="dashboard-title">Fulqrom live NABERS rating dashboard</title>
      <desc id="dashboard-desc">
        A stylised preview of the Fulqrom dashboard showing a live 4.8 star NABERS rating trending up,
        with a 12-month consumption trend line and building health metric cards.
      </desc>

      <defs>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Card frame */}
      <rect x="0" y="0" width="600" height="450" rx="24" fill="url(#cardGrad)" />
      <rect x="0.5" y="0.5" width="599" height="449" rx="23.5" fill="none" stroke="#ffffff" strokeOpacity="0.18" />

      {/* Top bar */}
      <circle cx="28" cy="28" r="5" fill="#ffffff" fillOpacity="0.6" />
      <circle cx="46" cy="28" r="5" fill="#ffffff" fillOpacity="0.35" />
      <circle cx="64" cy="28" r="5" fill="#ffffff" fillOpacity="0.35" />
      <text x="300" y="33" textAnchor="middle" fill="#ffffff" fillOpacity="0.7" fontFamily="Poppins, sans-serif" fontSize="13">
        Fulqrom · Live NABERS Rating
      </text>

      {/* Star rating gauge */}
      <g transform="translate(48, 70)">
        <circle cx="80" cy="80" r="72" fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="14" />
        <circle
          cx="80"
          cy="80"
          r="72"
          fill="none"
          stroke="#ffffff"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 72 * 0.8} ${2 * Math.PI * 72}`}
          transform="rotate(-90 80 80)"
        />
        <text x="80" y="72" textAnchor="middle" fill="#ffffff" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="40">
          4.8
        </text>
        <text x="80" y="98" textAnchor="middle" fill="#ffffff" fillOpacity="0.8" fontFamily="Poppins, sans-serif" fontSize="13">
          NABERS stars · live
        </text>
      </g>

      {/* Trend label + line chart */}
      <g transform="translate(240, 90)">
        <text x="0" y="0" fill="#ffffff" fillOpacity="0.85" fontFamily="Poppins, sans-serif" fontSize="13">
          12-month rating trend
        </text>
        <polyline
          points="0,90 40,95 80,80 120,88 160,60 200,64 240,42 280,48 320,20"
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[
          [0, 90],
          [80, 80],
          [160, 60],
          [240, 42],
          [320, 20],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="5" fill="#ffffff" />
        ))}
        <text x="320" y="12" textAnchor="end" fill="#ffffff" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="15">
          ↑ trending up
        </text>
      </g>

      {/* Metric cards */}
      <g transform="translate(48, 260)" fontFamily="Poppins, sans-serif">
        {[
          { label: 'Live data feeds', value: '3 meters + BMS' },
          { label: 'Days to next assessment', value: '214' },
          { label: 'Active alerts', value: '0 — all clear' },
        ].map((m, i) => (
          <g key={i} transform={`translate(${i * 168}, 0)`}>
            <rect width="152" height="92" rx="14" fill="#ffffff" fillOpacity="0.1" />
            <text x="16" y="30" fill="#ffffff" fillOpacity="0.75" fontSize="11">
              {m.label}
            </text>
            <text x="16" y="60" fill="#ffffff" fontWeight="700" fontSize="18">
              {m.value}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}
