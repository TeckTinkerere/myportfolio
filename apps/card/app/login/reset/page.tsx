import type { Metadata } from 'next'
import Link from 'next/link'

import { ResetForm } from './reset-form'

export const metadata: Metadata = { title: 'Set a new password' }

/** Where the emailed reset link lands, with ?token=… (or ?error=INVALID_TOKEN). */
export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>
}) {
  const { token, error } = await searchParams
  const usable = token && token !== 'INVALID_TOKEN' && !error

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <p className="label-mono text-ink-muted">card.mohdaslam.dev</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Set a new password</h1>
        {usable ? (
          <ResetForm token={token} />
        ) : (
          <div className="mt-6 rounded-md border border-border-strong bg-surface p-4 text-sm">
            <p>This reset link is invalid or has expired.</p>
            <Link href="/login/forgot" className="mt-3 inline-block text-accent underline-offset-4 hover:underline">
              Request a new link
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
