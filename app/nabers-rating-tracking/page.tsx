import { redirect } from 'next/navigation'

// Legacy route — this campaign now lives at /campaigns/nabers-rating-tracking
// as part of the Raven Labs Landing Page Studio's dynamic campaign routing
// (master spec §17). Kept as a redirect so an already-configured Google Ads
// Final URL pointing here keeps working.
export default function LegacyNabersPage() {
  redirect('/campaigns/nabers-rating-tracking')
}
