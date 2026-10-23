import type { Metadata } from 'next'

import { qrSvg } from '@/components/card/qr-svg'
import { Chrome } from '@/components/chrome'
import { formatSgTime } from '@/lib/card/csv'
import { listAllProfiles, listInvites, listTags, type InviteRow } from '@/lib/data'
import { siteUrl } from '@/lib/env'
import { requireAdmin } from '@/lib/session'

import { assignTagAction, createTagAction, deleteTagAction, uninviteAction } from './actions'
import { InviteForm } from './invite-form'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin' }

const input =
  'rounded-md border border-border-strong bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25'

export default async function AdminPage() {
  const member = await requireAdmin()
  const [invites, tags, profiles] = await Promise.all([listInvites(), listTags(), listAllProfiles()])
  const base = siteUrl()

  return (
    <Chrome member={member}>
      <main className="mx-auto max-w-4xl space-y-12 px-4 py-10">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="text-ink-muted">Who can make cards, and which physical cards open which profile.</p>
        </div>

        {/* ------------------------------------------------------- invites */}
        <section>
          <h2 className="text-lg font-semibold">Invites</h2>
          <p className="text-sm text-ink-muted">
            Inviting someone makes a one-time link that only works with their email. Send it to them yourself.
            To replace a lost or expired link, invite the same email again.
          </p>
          <InviteForm />
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border-strong bg-surface text-sm">
            {invites.map((i) => (
              <li key={i.email} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span>
                  {i.email}
                  {i.is_admin && <span className="ml-2 text-xs text-accent">admin</span>}
                  <span className="ml-2 text-xs text-ink-muted">{inviteStatus(i)}</span>
                </span>
                {i.email.toLowerCase() !== member.email.toLowerCase() && (
                  <form action={uninviteAction.bind(null, i.email)}>
                    <button className="text-xs text-ink-muted hover:text-danger">Remove</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------------- tags */}
        <section>
          <h2 className="text-lg font-semibold">NFC tags</h2>
          <p className="text-sm text-ink-muted">
            Write the tag URL onto a chip once (the NFC Tools app: Write → Add a record → URL). Re-point it here
            any time without rewriting the chip.
          </p>
          <form action={createTagAction} className="mt-4 flex flex-wrap items-center gap-2">
            <input name="label" maxLength={60} placeholder="Label, e.g. Aslam's metal card" className={`${input} w-64`} />
            <ProfileSelect profiles={profiles} />
            <button className="h-9 rounded-md bg-accent px-3 text-sm font-semibold text-accent-contrast">New tag</button>
          </form>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {tags.map((t) => {
              const url = `${base}/t/${t.id}`
              return (
                <li key={t.id} className="flex gap-4 rounded-lg border border-border-strong bg-surface p-4">
                  <div className="h-24 w-24 shrink-0" dangerouslySetInnerHTML={{ __html: qrSvg(url, { margin: 1 }) }} />
                  <div className="min-w-0 flex-1 space-y-2 text-sm">
                    <p className="font-medium">{t.label || 'Untitled tag'}</p>
                    <p className="break-all font-mono text-xs text-ink-muted">{url}</p>
                    <form action={assignTagAction.bind(null, t.id)} className="flex items-center gap-2">
                      <ProfileSelect profiles={profiles} value={t.profile_id ?? ''} />
                      <button className="text-xs text-accent hover:underline">Save</button>
                    </form>
                    <form action={deleteTagAction.bind(null, t.id)}>
                      <button className="text-xs text-ink-muted hover:text-danger">Delete tag</button>
                    </form>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </Chrome>
  )
}

function inviteStatus(i: InviteRow): string {
  if (i.joined) return 'joined'
  if (!i.token_expires_at) return 'no link yet: invite again to make one'
  return new Date(i.token_expires_at).getTime() > Date.now()
    ? `link expires ${formatSgTime(i.token_expires_at)}`
    : 'link expired: invite again'
}

function ProfileSelect({
  profiles,
  value,
}: {
  profiles: { id: string; handle: string; email: string }[]
  value?: string
}) {
  return (
    <select name="profile" defaultValue={value ?? ''} className={`${input} max-w-[14rem]`} aria-label="Opens card">
      <option value="">Not assigned</option>
      {profiles.map((p) => (
        <option key={p.id} value={p.id}>
          /{p.handle} ({p.email})
        </option>
      ))}
    </select>
  )
}
