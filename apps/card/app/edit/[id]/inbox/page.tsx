import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Chrome } from '@/components/chrome'
import { formatSgTime } from '@/lib/card/csv'
import { getProfile, listLeads } from '@/lib/data'
import { requireMember } from '@/lib/session'

import { removeLead } from '../../actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Inbox' }

const FIELD_ORDER = ['name', 'designation', 'company', 'email', 'mobile', 'message'] as const

export default async function Inbox({ params }: { params: Promise<{ id: string }> }) {
  const member = await requireMember()
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const profile = await getProfile(id, member.id)
  if (!profile) notFound()
  const leads = await listLeads(id, member.id)

  return (
    <Chrome member={member}>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link href={`/edit/${id}`} className="text-sm text-ink-muted hover:text-ink">
          ← Back to editor
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight">Inbox</h1>
            <p className="text-ink-muted">Contact-form submissions to /{profile.handle}</p>
          </div>
          {leads.length > 0 && (
            <a href={`/edit/${id}/leads.csv`} className="text-sm text-accent underline-offset-4 hover:underline">
              Download CSV
            </a>
          )}
        </div>

        {leads.length === 0 ? (
          <p className="mt-10 rounded-lg border border-dashed border-border-strong p-8 text-center text-ink-muted">
            Nothing yet. Add a Contact form block to your card to collect details.
          </p>
        ) : (
          <ul className="mt-8 flex flex-col gap-3">
            {leads.map((lead) => (
              <li key={lead.id} className="rounded-lg border border-border-strong bg-surface p-4">
                <div className="flex items-start justify-between gap-4">
                  <dl className="grid grid-cols-[7rem_1fr] gap-x-3 gap-y-1 text-sm">
                    {FIELD_ORDER.filter((k) => lead.fields[k]).map((k) => (
                      <div key={k} className="contents">
                        <dt className="capitalize text-ink-muted">{k}</dt>
                        <dd className="whitespace-pre-line break-words">
                          {k === 'email' ? (
                            <a href={`mailto:${lead.fields[k]}`} className="text-accent">
                              {lead.fields[k]}
                            </a>
                          ) : (
                            lead.fields[k]
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <form action={removeLead.bind(null, id, lead.id)}>
                    <button className="text-xs text-ink-muted hover:text-danger">Delete</button>
                  </form>
                </div>
                <p className="mt-3 text-xs text-ink-muted">
                  {formatSgTime(lead.created_at)}
                  {' · consented'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </Chrome>
  )
}
