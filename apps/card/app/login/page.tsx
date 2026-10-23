import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getAuth } from '@/lib/auth/server'
import { isInviteTokenShape } from '@/lib/invite-token'
import { getMember } from '@/lib/session'

import { signOut } from './actions'
import { LoginForm } from './login-form'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string; invite?: string | string[] }>
}) {
  const { denied, invite: rawInvite } = await searchParams
  if (await getMember()) redirect('/edit')
  const invite = typeof rawInvite === 'string' && isInviteTokenShape(rawInvite) ? rawInvite : null

  // Signed in, but this account has not joined with an invite link.
  const { data } = await getAuth().getSession()
  const notInvited = Boolean(data?.user)

  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <p className="label-mono text-ink-muted">card.mohdaslam.dev</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Edit your card</h1>

        {notInvited ? (
          <div className="mt-6 rounded-md border border-border-strong bg-surface p-4 text-sm">
            <p>
              You&rsquo;re signed in as <strong>{data?.user.email}</strong>, but this account hasn&rsquo;t joined
              with an invite link. Sign out, then open your invite link again.
            </p>
            <form action={signOut} className="mt-4">
              <button className="text-accent underline-offset-4 hover:underline">Sign out</button>
            </form>
          </div>
        ) : (
          <div className="mt-8">
            {denied && <p className="mb-4 text-sm text-ink-muted">Sign in to continue.</p>}
            <LoginForm invite={invite} />
          </div>
        )}
      </div>
    </main>
  )
}
