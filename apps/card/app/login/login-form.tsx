'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'

import { signIn, signUp, type AuthState } from './actions'

/**
 * Sign in for everyone; Create account only when opened from an invite
 * link. The link's token rides along in a hidden field either way, so an
 * existing account can also redeem it by signing in.
 */
export function LoginForm({ invite }: { invite: string | null }) {
  const [mode, setMode] = useState<'in' | 'up'>(invite ? 'up' : 'in')
  const [inState, inAction, inPending] = useActionState<AuthState, FormData>(signIn, null)
  const [upState, upAction, upPending] = useActionState<AuthState, FormData>(signUp, null)
  const state = mode === 'in' ? inState : upState
  const pending = mode === 'in' ? inPending : upPending

  const input =
    'mt-1.5 block w-full rounded-md border border-border-strong bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25'

  return (
    <div>
      {invite ? (
        <div role="tablist" className="grid grid-cols-2 rounded-md border border-border-strong p-1 text-sm">
          {(['up', 'in'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`rounded px-3 py-2 font-medium transition ${mode === m ? 'bg-accent text-accent-contrast' : 'text-ink-muted hover:text-ink'}`}
            >
              {m === 'in' ? 'I have an account' : 'Create account'}
            </button>
          ))}
        </div>
      ) : null}

      <form action={mode === 'in' ? inAction : upAction} className="mt-6 flex flex-col gap-4 text-sm">
        {invite && <input type="hidden" name="invite" value={invite} />}
        {mode === 'up' && (
          <label className="font-medium">
            Your name
            <input name="name" required autoComplete="name" className={input} />
          </label>
        )}
        <label className="font-medium">
          Email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
            className={input}
          />
        </label>

        {mode === 'in' && (
          <Link href="/login/forgot" className="-mt-2 self-end text-xs text-ink-muted underline-offset-4 hover:text-ink hover:underline">
            Forgot password?
          </Link>
        )}

        {state?.error && (
          <p role="alert" className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-danger">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-accent font-semibold text-accent-contrast transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? 'One moment…' : mode === 'in' ? 'Sign in' : 'Create account'}
        </button>
        <p className="text-xs text-ink-muted">
          {invite
            ? 'Use the email this invite was made for.'
            : 'Accounts are invite-only. To join, open the invite link you were sent.'}
        </p>
      </form>
    </div>
  )
}
