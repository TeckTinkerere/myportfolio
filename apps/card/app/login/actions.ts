'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { getAuth } from '@/lib/auth/server'
import { getInvite, markInviteAccepted } from '@/lib/data'

export type AuthState = { error: string } | null

const credentials = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email.'),
  password: z.string().min(8, 'Use at least 8 characters for your password.').max(200),
})

export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const parsed = credentials.safeParse({ email: form.get('email'), password: form.get('password') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check your details.' }

  const { error } = await getAuth().signIn.email(parsed.data)
  if (error) return { error: 'That email and password did not match.' }
  redirect('/edit')
}

/**
 * Account creation, invite-only. The invite check runs here, before the
 * auth server is asked to create anything, and the public sign-up endpoint
 * is blocked in app/api/auth (see that route).
 */
export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const parsed = credentials
    .extend({ name: z.string().trim().min(1, 'Enter your name.').max(80) })
    .safeParse({ email: form.get('email'), password: form.get('password'), name: form.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check your details.' }

  const invite = await getInvite(parsed.data.email)
  if (!invite) {
    return { error: 'This app is invite-only, and that email is not on the list. Ask Aslam for an invite.' }
  }

  const { error } = await getAuth().signUp.email(parsed.data)
  if (error) {
    return { error: error.message?.includes('exist') ? 'You already have an account. Sign in instead.' : 'Could not create the account. Try again.' }
  }
  await markInviteAccepted(parsed.data.email)
  redirect('/edit')
}

export async function signOut() {
  await getAuth().signOut()
  redirect('/login')
}
