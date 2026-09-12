import type { Campaign } from '@/lib/types'

/**
 * Triggers a deployment of THIS SAME Vercel project (master spec §18/§19) —
 * never a new project per campaign. Because every campaign is just a
 * dynamic `/campaigns/[slug]` route reading from the shared data layer, a
 * campaign "goes live" the moment the project itself is deployed with that
 * campaign's data saved — this call is what triggers (or confirms) that
 * project-level deployment via Vercel's REST API.
 *
 * Only called when VERCEL_TOKEN + VERCEL_PROJECT_ID are both set — see
 * lib/actions/campaigns.ts `publishCampaign`. Never fabricates success.
 */
export async function triggerVercelDeployment(campaign: Campaign): Promise<{ deploymentId: string; url: string }> {
  const token = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  const teamId = process.env.VERCEL_TEAM_ID

  if (!token || !projectId) {
    throw new Error('VERCEL_TOKEN / VERCEL_PROJECT_ID not configured')
  }

  const res = await fetch(
    `https://api.vercel.com/v13/deployments${teamId ? `?teamId=${teamId}` : ''}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'raven-landing-page-studio',
        project: projectId,
        target: 'production',
        gitSource: undefined, // redeploys the project's existing production Git source
      }),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Vercel API ${res.status}: ${body}`)
  }

  const data = (await res.json()) as { id: string; url: string }
  return { deploymentId: data.id, url: `https://${data.url}/campaigns/${campaign.slug}` }
}
