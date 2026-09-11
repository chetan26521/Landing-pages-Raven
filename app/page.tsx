import { redirect } from 'next/navigation'

// This project hosts one campaign page per route. The Google Ads Final URL
// should point directly at /nabers-rating-tracking — this root redirect is
// just a safety net for anyone who hits the bare domain.
export default function RootPage() {
  redirect('/nabers-rating-tracking')
}
