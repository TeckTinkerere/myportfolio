import { getMember } from '@/lib/session'
import { getProfile, listLeads } from '@/lib/data'

const COLUMNS = ['created_at', 'name', 'designation', 'company', 'email', 'mobile', 'message'] as const

/** CSV-escape, and neutralise spreadsheet formula injection. */
function cell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const member = await getMember()
  if (!member) return new Response('Unauthorized', { status: 401 })
  const { id } = await params
  const profile = await getProfile(id, member.id)
  if (!profile) return new Response('Not found', { status: 404 })

  const leads = await listLeads(id, member.id)
  const rows = [COLUMNS.join(',')]
  for (const lead of leads) {
    rows.push(COLUMNS.map((c) => cell(c === 'created_at' ? lead.created_at : (lead.fields[c] ?? ''))).join(','))
  }

  return new Response(rows.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${profile.handle}-contacts.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}
