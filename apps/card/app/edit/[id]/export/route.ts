import { getMember } from '@/lib/session'
import { getProfile, listLeads } from '@/lib/data'

/** Everything stored for one card, as JSON: the owner's copy of their data. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return new Response('Unauthorized', { status: 401 })
  const { id } = await params
  const profile = await getProfile(id, member.id)
  if (!profile) return new Response('Not found', { status: 404 })

  const body = {
    exportedAt: new Date().toISOString(),
    handle: profile.handle,
    draft: profile.draft,
    published: profile.published,
    publishedAt: profile.published_at,
    contactFormSubmissions: await listLeads(id, member.id),
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${profile.handle}-export.json"`,
      'Cache-Control': 'no-store',
    },
  })
}
