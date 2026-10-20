'use client'

import Link from 'next/link'
import { useActionState } from 'react'

import { completeReset, type ResetState } from '../reset-actions'

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<ResetState, FormData>(completeReset, { status: 'idle' })

  if (state.status === 'done') {
    return (
      <div role="status" className="mt-6 rounded-md border border-border-strong bg-surface p-4 text-sm">
        <p>Your password has been changed.</p>
        <Link href="/login" className="mt-3 inline-block text-accent underline-offset-4 hover:underline">
          Sign in
        </Link>
      </div>
    )
  }

  const input =
    'mt-1.5 block w-full rounded-md border border-border-strong bg-surface px-3 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25'

  return (
    <form action={action} className="mt-6 flex flex-col gap-4 text-sm">
      <input type="hidden" name="token" value={token} />
      <label className="font-medium">
        New password
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={input} />
      </label>
      <label className="font-medium">
        Type it again
        <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className={input} />
      </label>
      {state.status === 'error' && (
        <p role="alert" className="text-danger">
          {state.message}{' '}
          {state.message.includes('expired') && (
            <Link href="/login/forgot" className="underline">
              New link
            </Link>
          )}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-11 rounded-md bg-accent font-semibold text-accent-contrast transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save new password'}
      </button>
    </form>
  )
}
