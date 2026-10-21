import { leadsToCsv } from '@/lib/card/csv'
import { getMember } from '@/lib/session'
import { getProfile, listLeads } from '@/lib/data'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return new Response('Unauthorized', { status: 401 })
  const { id } = await params
  const profile = await getProfile(id, member.id)
  if (!profile) return new Response('Not found', { status: 404 })

  return new Response(leadsToCsv(await listLeads(id, member.id)), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${profile.handle}-contacts.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
