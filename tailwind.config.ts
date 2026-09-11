import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        raven: {
          purple: '#4a00e1',
          purple2: '#6400E1',
          purple3: '#7900E1',
          purple4: '#8300e2',
        },
      },
      fontFamily: {
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        body: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'raven-gradient': 'linear-gradient(135deg, #4a00e1 0%, #6400E1 33%, #7900E1 66%, #8300e2 100%)',
      },
    },
  },
  plugins: [],
}
export default config
