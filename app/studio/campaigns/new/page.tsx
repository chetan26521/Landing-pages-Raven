import type { Metadata } from 'next'
import { createCampaignAction } from '@/lib/actions/campaigns'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export const metadata: Metadata = { title: 'Create Campaign' }

export default function NewCampaignPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Create campaign</h1>
        <p className="text-muted-foreground">
          Describe the campaign in a sentence, or fill in the fields directly — anything left blank is
          inferred. On submit, the Studio runs research, strategy, copy, page structure, SEO, Google Ads
          readiness, and QA automatically (§59); nothing is deployed or approved without you (§39).
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form action={createCampaignAction} className="grid gap-5">
            <div>
              <Label htmlFor="freeText">Campaign brief (optional — natural language)</Label>
              <Textarea
                id="freeText"
                name="freeText"
                rows={3}
                placeholder="Create a Google Ads campaign for Raven Labs targeting US mid-market businesses looking for Salesforce automation services."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Campaign name</Label>
                <Input id="name" name="name" placeholder="Salesforce Consulting — US" />
              </div>
              <div>
                <Label htmlFor="service">Service / offering</Label>
                <Input id="service" name="service" placeholder="Salesforce consulting" />
              </div>
              <div>
                <Label htmlFor="audience">Target audience</Label>
                <Input id="audience" name="audience" placeholder="Mid-market businesses" />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" name="industry" placeholder="B2B services" />
              </div>
              <div>
                <Label htmlFor="geography">Geography</Label>
                <Input id="geography" name="geography" placeholder="United States" />
              </div>
              <div>
                <Label htmlFor="objective">Primary objective</Label>
                <Input id="objective" name="objective" placeholder="Generate qualified leads via Google Ads" />
              </div>
              <div>
                <Label htmlFor="primaryIntent">Google Ads intent / primary search term</Label>
                <Input id="primaryIntent" name="primaryIntent" placeholder="salesforce consulting" />
              </div>
              <div>
                <Label htmlFor="primaryCTA">Primary CTA</Label>
                <Input id="primaryCTA" name="primaryCTA" placeholder="Get my free Salesforce assessment" />
              </div>
              <div>
                <Label htmlFor="offer">Offer (optional)</Label>
                <Input id="offer" name="offer" placeholder="Free Salesforce assessment" />
              </div>
              <div>
                <Label htmlFor="existingKeywords">Existing keywords (optional, comma-separated)</Label>
                <Input id="existingKeywords" name="existingKeywords" placeholder="salesforce consulting, salesforce implementation" />
              </div>
            </div>

            <div>
              <Label htmlFor="competitorUrls">Competitor URLs (optional, one per line or comma-separated)</Label>
              <Textarea id="competitorUrls" name="competitorUrls" rows={2} placeholder="https://competitor-a.com" />
            </div>

            <div>
              <Label htmlFor="additionalInstructions">Additional instructions (optional)</Label>
              <Textarea id="additionalInstructions" name="additionalInstructions" rows={2} />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" size="lg">Create campaign</Button>
              <p className="text-sm text-muted-foreground">
                Takes a few seconds — research through QA all run before you land in the workspace.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
