import type { Metadata } from 'next'
import Link from 'next/link'

import { Chrome } from '@/components/chrome'
import { listProfiles } from '@/lib/data'
import { siteUrl } from '@/lib/env'
import { requireMember } from '@/lib/session'

import { CreateCardForm } from './create-card-form'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'My cards' }

export default async function EditIndex() {
  const member = await requireMember()
  const profiles = await listProfiles(member.id)
  const host = siteUrl().replace(/^https?:\/\//, '')

  return (
    <Chrome member={member}>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight">My cards</h1>
        <p className="mt-1 text-ink-muted">
          One card per role is fine: work, a side project, events. Each has its own link.
        </p>

        {profiles.length > 0 && (
          <ul className="mt-8 divide-y divide-border rounded-lg border border-border-strong bg-surface">
            {profiles.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="font-medium">{p.name}</p>
                  <p className="font-mono text-xs text-ink-muted">
                    {host}/{p.handle}
                    {' · '}
                    {!p.published_at ? 'not published' : p.has_unpublished ? 'unpublished changes' : 'live'}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Link href={`/edit/${p.id}/inbox`} className="text-ink-muted hover:text-ink">
                    Inbox{p.lead_count > 0 && ` (${p.lead_count})`}
                  </Link>
                  <Link href={`/edit/${p.id}/nfc`} className="text-ink-muted hover:text-ink">
                    NFC
                  </Link>
                  <Link href={`/edit/${p.id}/print`} className="text-ink-muted hover:text-ink">
                    Print
                  </Link>
                  {p.published_at && (
                    <a href={`/${p.handle}`} target="_blank" className="text-ink-muted hover:text-ink">
                      View
                    </a>
                  )}
                  <Link
                    href={`/edit/${p.id}`}
                    className="rounded-md bg-accent px-3 py-1.5 font-medium text-accent-contrast hover:opacity-90"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}

        <section className="mt-10 rounded-lg border border-border-strong bg-surface p-5">
          <h2 className="font-semibold">{profiles.length ? 'New card' : 'Create your first card'}</h2>
          <CreateCardForm host={host} />
        </section>
      </main>
    </Chrome>
  )
}
