import { CheckCircle2 } from 'lucide-react'
import { submitLead } from '@/lib/submit-lead'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Campaign } from '@/lib/types'

export default function FinalCta({ campaign }: { campaign: Campaign }) {
  const copy = campaign.copy!.finalCta
  return (
    <section id="final-cta" className="relative overflow-hidden rl-section bg-raven-gradient text-white">
      <div className="absolute inset-0 rl-grid-pattern opacity-30" aria-hidden="true" />
      <div className="container relative mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">{copy.headline}</h2>
        <p className="text-lg opacity-90 mb-8">{copy.body}</p>

        <form
          action={submitLead}
          className="relative grid gap-4 p-6 md:p-8 bg-white/10 backdrop-blur rounded-2xl text-left shadow-xl"
          noValidate
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name" className="text-white/90">First name</Label>
              <Input id="first_name" name="first_name" required autoComplete="given-name" onGradient />
            </div>
            <div>
              <Label htmlFor="email" className="text-white/90">Work email</Label>
              <Input type="email" id="email" name="email" required autoComplete="email" inputMode="email" onGradient />
            </div>
          </div>
          <div>
            <Label htmlFor="company" className="text-white/90">Company</Label>
            <Input id="company" name="company" required autoComplete="organization" onGradient />
          </div>
          <div>
            <Label htmlFor="phone" className="text-white/90">Phone (optional)</Label>
            <Input type="tel" id="phone" name="phone" autoComplete="tel" inputMode="tel" onGradient />
          </div>

          {/* Honeypot */}
          <div className="absolute -left-[9999px] w-px h-px" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <input type="hidden" name="campaign_slug" value={campaign.slug} />
          {/* Attribution — populated from sessionStorage by EventTracking on page load */}
          <input type="hidden" id="gclid" name="gclid" />
          <input type="hidden" id="utm_source" name="utm_source" />
          <input type="hidden" id="utm_medium" name="utm_medium" />
          <input type="hidden" id="utm_campaign" name="utm_campaign" />
          <input type="hidden" id="utm_term" name="utm_term" />
          <input type="hidden" id="utm_content" name="utm_content" />

          <Button type="submit" variant="onGradient" size="lg" data-cta="final" className="mt-1">
            <CheckCircle2 aria-hidden="true" />
            {campaign.primaryCTA}
          </Button>
          <p className="text-xs opacity-80 text-center">
            By submitting, you agree to our{' '}
            <a href="https://theravenlabs.com/privacy-policy/" className="underline">Privacy Policy</a>. We reply
            within 4 business hours.
          </p>
        </form>
      </div>
    </section>
  )
}
