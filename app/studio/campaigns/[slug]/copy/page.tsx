import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateCampaignCopy, regenerateLandingPage } from '@/lib/actions/campaigns'
import type { CampaignCopy } from '@/lib/types'

export const metadata: Metadata = { title: 'Copy' }
export const dynamic = 'force-dynamic'

export default function CopyPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)
  const copy = campaign.copy

  if (!copy) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">No copy generated yet.</CardContent></Card>
  }

  const save = async (formData: FormData) => {
    'use server'
    const get = (k: string) => String(formData.get(k) ?? '')
    const next: CampaignCopy = {
      generatedAt: new Date().toISOString(),
      hero: { headline: get('hero_headline'), subheadline: get('hero_subheadline'), microcopy: get('hero_microcopy') },
      problem: { headline: get('problem_headline'), body: get('problem_body') },
      benefits: {
        headline: get('benefits_headline'),
        intro: get('benefits_intro'),
        items: copy.benefits.items.map((item, i) => ({
          title: get(`benefit_${i}_title`) || item.title,
          body: get(`benefit_${i}_body`) || item.body,
          icon: item.icon,
        })),
      },
      proof: { headline: get('proof_headline'), note: get('proof_note') },
      howItWorks: {
        headline: get('how_headline'),
        intro: get('how_intro'),
        steps: copy.howItWorks.steps.map((step, i) => ({
          title: get(`step_${i}_title`) || step.title,
          body: get(`step_${i}_body`) || step.body,
        })),
      },
      faq: {
        headline: get('faq_headline'),
        items: copy.faq.items.map((item, i) => ({
          q: get(`faq_${i}_q`) || item.q,
          a: get(`faq_${i}_a`) || item.a,
        })),
      },
      finalCta: { headline: get('final_headline'), body: get('final_body') },
    }
    await updateCampaignCopy(campaign.id, next)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground max-w-2xl">
          Edit any section below and save, or regenerate the whole landing page from the current strategy —
          regenerating creates a new version rather than overwriting history (§51).
        </p>
        <form action={regenerateLandingPage.bind(null, campaign.id)}>
          <Button type="submit" variant="outline" size="sm">Regenerate from strategy</Button>
        </form>
      </div>

      <form action={save} className="space-y-6">
        <Section title="Hero">
          <Field label="Headline" name="hero_headline" defaultValue={copy.hero.headline} />
          <Field label="Subheadline" name="hero_subheadline" textarea defaultValue={copy.hero.subheadline} />
          <Field label="Microcopy" name="hero_microcopy" defaultValue={copy.hero.microcopy} />
        </Section>

        <Section title="Problem">
          <Field label="Headline" name="problem_headline" defaultValue={copy.problem.headline} />
          <Field label="Body" name="problem_body" textarea defaultValue={copy.problem.body} />
        </Section>

        <Section title="Benefits">
          <Field label="Headline" name="benefits_headline" defaultValue={copy.benefits.headline} />
          <Field label="Intro" name="benefits_intro" textarea defaultValue={copy.benefits.intro} />
          {copy.benefits.items.map((item, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3">
              <Field label={`Benefit ${i + 1} title`} name={`benefit_${i}_title`} defaultValue={item.title} />
              <Field label={`Benefit ${i + 1} body`} name={`benefit_${i}_body`} defaultValue={item.body} />
            </div>
          ))}
        </Section>

        <Section title="Proof">
          <Field label="Headline" name="proof_headline" defaultValue={copy.proof.headline} />
          <Field label="Note" name="proof_note" textarea defaultValue={copy.proof.note} />
        </Section>

        <Section title="How it works">
          <Field label="Headline" name="how_headline" defaultValue={copy.howItWorks.headline} />
          <Field label="Intro" name="how_intro" defaultValue={copy.howItWorks.intro} />
          {copy.howItWorks.steps.map((step, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3">
              <Field label={`Step ${i + 1} title`} name={`step_${i}_title`} defaultValue={step.title} />
              <Field label={`Step ${i + 1} body`} name={`step_${i}_body`} defaultValue={step.body} />
            </div>
          ))}
        </Section>

        <Section title="FAQ">
          <Field label="Headline" name="faq_headline" defaultValue={copy.faq.headline} />
          {copy.faq.items.map((item, i) => (
            <div key={i} className="grid gap-2 rounded-lg bg-muted/40 p-3">
              <Field label={`Question ${i + 1}`} name={`faq_${i}_q`} defaultValue={item.q} />
              <Field label={`Answer ${i + 1}`} name={`faq_${i}_a`} textarea defaultValue={item.a} />
            </div>
          ))}
        </Section>

        <Section title="Final CTA">
          <Field label="Headline" name="final_headline" defaultValue={copy.finalCta.headline} />
          <Field label="Body" name="final_body" textarea defaultValue={copy.finalCta.body} />
        </Section>

        <Button type="submit">Save copy</Button>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="font-display font-semibold">{title}</h3>
        {children}
      </CardContent>
    </Card>
  )
}

function Field({
  label,
  name,
  defaultValue,
  textarea,
}: {
  label: string
  name: string
  defaultValue?: string
  textarea?: boolean
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      {textarea ? (
        <Textarea id={name} name={name} defaultValue={defaultValue} rows={3} />
      ) : (
        <Input id={name} name={name} defaultValue={defaultValue} />
      )}
    </div>
  )
}
