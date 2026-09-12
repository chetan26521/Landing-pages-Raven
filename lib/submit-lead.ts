'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'

// Generic lead schema shared by every campaign's conversion form (master
// spec §32). Campaign attribution travels via hidden fields the section
// component renders — see components/sections/FinalCta.tsx.
const LeadSchema = z.object({
  first_name: z.string().min(1),
  email: z.string().email(),
  company: z.string().min(1),
  phone: z.string().optional(),
  campaign_slug: z.string().min(1),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  gclid: z.string().optional(),
  // Honeypot — if filled, treat as a bot and silently drop.
  website: z.string().max(0).optional(),
  recaptcha_token: z.string().optional(),
})

export async function submitLead(formData: FormData) {
  const parsed = LeadSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    throw new Error('Invalid form data')
  }

  const slug = parsed.data.campaign_slug

  // Honeypot check — silently succeed without sending the lead anywhere.
  if (parsed.data.website) {
    redirect(`/campaigns/${slug}/thanks`)
  }

  // reCAPTCHA v3 — only enforced once RECAPTCHA_SECRET is set.
  if (process.env.RECAPTCHA_SECRET && parsed.data.recaptcha_token) {
    const captchaCheck = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${parsed.data.recaptcha_token}`,
    }).then((r) => r.json())

    if (!captchaCheck.success || captchaCheck.score < 0.5) {
      throw new Error('Failed spam check')
    }
  }

  // CRM webhook — only sent once ZOHO_WEBHOOK_URL is set (server-side env var only).
  // Never claim a lead was delivered to a CRM that isn't actually configured.
  if (process.env.ZOHO_WEBHOOK_URL) {
    await fetch(process.env.ZOHO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...parsed.data,
        source_page: `/campaigns/${slug}`,
      }),
    })
  }

  redirect(`/campaigns/${slug}/thanks`)
}
