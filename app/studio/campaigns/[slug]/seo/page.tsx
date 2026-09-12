import type { Metadata } from 'next'
import { requireCampaignBySlug } from '@/lib/studio-helpers'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateCampaignSeo } from '@/lib/actions/campaigns'
import type { SeoConfig } from '@/lib/types'

export const metadata: Metadata = { title: 'SEO' }
export const dynamic = 'force-dynamic'

export default function SeoPage({ params }: { params: { slug: string } }) {
  const campaign = requireCampaignBySlug(params.slug)
  const seo = campaign.seo

  if (!seo) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">No SEO config yet.</CardContent></Card>
  }

  const save = async (formData: FormData) => {
    'use server'
    const get = (k: string) => String(formData.get(k) ?? '')
    const next: SeoConfig = {
      title: get('title'),
      metaDescription: get('metaDescription'),
      canonicalPath: seo.canonicalPath,
      robots: get('robots') === 'noindex' ? 'noindex,nofollow' : 'index,follow',
      ogTitle: get('ogTitle') || get('title'),
      ogDescription: get('ogDescription') || get('metaDescription'),
      ogImage: get('ogImage') || undefined,
      primaryKeyword: seo.primaryKeyword,
    }
    await updateCampaignSeo(campaign.id, next)
  }

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <Card>
        <CardContent className="p-6">
          <form action={save} className="grid gap-4">
            <div>
              <Label htmlFor="title">Title ({seo.title.length}/60)</Label>
              <Input id="title" name="title" defaultValue={seo.title} maxLength={60} />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta description ({seo.metaDescription.length}/160)</Label>
              <Textarea id="metaDescription" name="metaDescription" defaultValue={seo.metaDescription} rows={2} maxLength={160} />
            </div>
            <div>
              <Label>Canonical URL</Label>
              <p className="text-sm text-muted-foreground font-mono">{seo.canonicalPath}</p>
            </div>
            <div>
              <Label htmlFor="robots">Indexing</Label>
              <select
                id="robots"
                name="robots"
                defaultValue={seo.robots === 'index,follow' ? 'index' : 'noindex'}
                className="flex h-12 w-full rounded-md border-2 border-input bg-background px-3 text-sm"
              >
                <option value="index">Index, follow (default for a live campaign)</option>
                <option value="noindex">Noindex, nofollow</option>
              </select>
            </div>
            <div>
              <Label htmlFor="ogTitle">OG title (optional)</Label>
              <Input id="ogTitle" name="ogTitle" defaultValue={seo.ogTitle} />
            </div>
            <div>
              <Label htmlFor="ogDescription">OG description (optional)</Label>
              <Textarea id="ogDescription" name="ogDescription" defaultValue={seo.ogDescription} rows={2} />
            </div>
            <div>
              <Label htmlFor="ogImage">OG image URL (optional)</Label>
              <Input id="ogImage" name="ogImage" defaultValue={seo.ogImage} placeholder="/og-image.png" />
            </div>
            <Button type="submit" className="w-fit">Save SEO</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <h3 className="font-display font-semibold">Search preview</h3>
          <div className="rounded-lg border border-border p-3">
            <p className="text-primary text-sm truncate">{campaign.deployment.publicUrl}</p>
            <p className="text-blue-800 text-lg leading-tight truncate">{seo.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{seo.metaDescription}</p>
          </div>
          <p className="text-xs text-muted-foreground">Primary keyword: <span className="font-medium">{seo.primaryKeyword}</span></p>
        </CardContent>
      </Card>
    </div>
  )
}
