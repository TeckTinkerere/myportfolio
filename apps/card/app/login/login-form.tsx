'use client'

import { useActionState, useState } from 'react'

import { signIn, signUp, type AuthState } from './actions'

export function LoginForm() {
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [inState, inAction, inPending] = useActionState<AuthState, FormData>(signIn, null)
  const [upState, upAction, upPending] = useActionState<AuthState, FormData>(signUp, null)
  const state = mode === 'in' ? inState : upState
  const pending = mode === 'in' ? inPending : upPending

  const input =
    'mt-1.5 block w-full rounded-md border border-border-strong bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25'

  return (
    <div>
      <div role="tablist" className="grid grid-cols-2 rounded-md border border-border-strong p-1 text-sm">
        {(['in', 'up'] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded px-3 py-2 font-medium transition ${mode === m ? 'bg-accent text-accent-contrast' : 'text-ink-muted hover:text-ink'}`}
          >
            {m === 'in' ? 'Sign in' : 'Create account'}
          </button>
        ))}
      </div>

      <form action={mode === 'in' ? inAction : upAction} className="mt-6 flex flex-col gap-4 text-sm">
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
        {mode === 'up' && (
          <p className="text-xs text-ink-muted">Accounts are invite-only. Use the email your invite was sent to.</p>
        )}
      </form>
    </div>
  )
}
