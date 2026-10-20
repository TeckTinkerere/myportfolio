import type { Metadata } from 'next'
import Link from 'next/link'

import { ForgotForm } from './forgot-form'

export const metadata: Metadata = { title: 'Reset password' }

export default function ForgotPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <p className="label-mono text-ink-muted">card.mohdaslam.dev</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Reset your password</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Enter the email you sign in with. We&rsquo;ll send a link to set a new password. It expires after 15 minutes.
        </p>
        <ForgotForm />
        <p className="mt-6 text-sm">
          <Link href="/login" className="text-accent underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
