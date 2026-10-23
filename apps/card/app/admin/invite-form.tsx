'use client'

import { useActionState, useState } from 'react'

import { formatSgTime } from '@/lib/card/csv'

import { inviteAction, type InviteState } from './actions'

const input =
  'rounded-md border border-border-strong bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/25'

/** Invite someone and show their one-time link, which is not stored anywhere. */
export function InviteForm() {
  const [state, action, pending] = useActionState<InviteState, FormData>(inviteAction, { status: 'idle' })
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(url)
    } catch {
      setCopied(null)
    }
  }

  return (
    <div className="mt-4 space-y-3">
      <form action={action} className="flex flex-wrap items-center gap-2">
        <input name="email" type="email" required maxLength={200} placeholder="friend@example.com" className={`${input} w-72`} />
        <label className="flex items-center gap-1.5 text-sm">
          <input type="checkbox" name="admin" className="h-4 w-4" /> Admin
        </label>
        <button disabled={pending} className="h-9 rounded-md bg-accent px-3 text-sm font-semibold text-accent-contrast disabled:opacity-60">
          {pending ? 'One moment…' : 'Invite'}
        </button>
      </form>

      {state.status === 'link' && (
        <div role="status" className="rounded-md border border-accent/40 bg-accent/5 p-3 text-sm">
          <p>
            Invite link for <strong>{state.email}</strong>. Send it to them yourself. It works once and expires{' '}
            {formatSgTime(state.expires)}. It is shown only now.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <input readOnly value={state.url} aria-label="Invite link" className={`${input} min-w-0 flex-1 font-mono text-xs`} onFocus={(e) => e.currentTarget.select()} />
            <button type="button" onClick={() => copy(state.url)} className="h-9 shrink-0 rounded-md border border-border-strong px-3 text-sm">
              {copied === state.url ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
      {state.status === 'updated' && (
        <p role="status" className="text-sm text-ink-muted">
          {state.email} has already joined; their admin setting is updated.
        </p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      )}
    </div>
  )
}
