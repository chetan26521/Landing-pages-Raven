import { redirect } from 'next/navigation'

// Legacy route — see app/nabers-rating-tracking/page.tsx.
export default function LegacyThanksPage() {
  redirect('/campaigns/nabers-rating-tracking/thanks')
}
