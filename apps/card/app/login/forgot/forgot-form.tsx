'use client'

import { useActionState } from 'react'

import { requestReset, type ResetState } from '../reset-actions'

export function ForgotForm() {
  const [state, action, pending] = useActionState<ResetState, FormData>(requestReset, { status: 'idle' })

  if (state.status === 'sent') {
    return (
      <p role="status" className="mt-6 rounded-md border border-border-strong bg-surface p-4 text-sm">
        If that email has an account, a reset link is on its way. Check your inbox and spam folder.
      </p>
    )
  }

  return (
    <form action={action} className="mt-6 flex flex-col gap-4 text-sm">
      <label className="font-medium">
        Email
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1.5 block w-full rounded-md border border-border-strong bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
      </label>
      {state.status === 'error' && (
        <p role="alert" className="text-danger">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-md bg-accent font-semibold text-accent-contrast transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  )
}
