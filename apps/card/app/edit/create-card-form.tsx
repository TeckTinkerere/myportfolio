'use client'

import { useActionState, useState } from 'react'

import { handleProblem, normaliseHandle } from '@/lib/card/handles'

import { createCard, type CreateState } from './actions'

export function CreateCardForm({ host }: { host: string }) {
  const [state, action, pending] = useActionState<CreateState, FormData>(createCard, null)
  const [handle, setHandle] = useState('')
  const problem = handle ? handleProblem(handle) : null

  const input =
    'mt-1.5 block w-full rounded-md border border-border-strong bg-background px-3 py-2 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/25'

  return (
    <form action={action} className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
      <label className="font-medium">
        Name on the card
        <input name="name" required maxLength={80} placeholder="Mohamed Aslam" className={input} />
      </label>
      <label className="font-medium">
        Link
        <div className="mt-1.5 flex items-center rounded-md border border-border-strong bg-background focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/25">
          <span className="pl-3 font-mono text-xs text-ink-muted">{host}/</span>
          <input
            name="handle"
            required
            value={handle}
            onChange={(e) => setHandle(normaliseHandle(e.target.value))}
            placeholder="aslam"
            className="w-full bg-transparent px-1 py-2 font-mono outline-none"
            aria-describedby="handle-help"
          />
        </div>
        <span id="handle-help" className={`mt-1 block text-xs ${problem ? 'text-danger' : 'text-ink-muted'}`}>
          {problem ?? 'Lowercase letters, numbers and hyphens. You can change it later.'}
        </span>
      </label>
      {state?.error && (
        <p role="alert" className="text-danger sm:col-span-2">
          {state.error}
        </p>
      )}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending || Boolean(problem)}
          className="h-10 rounded-md bg-accent px-4 font-semibold text-accent-contrast hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'Creating…' : 'Create card'}
        </button>
      </div>
    </form>
  )
}
