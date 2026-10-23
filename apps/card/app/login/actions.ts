'use server'

import { redirect } from 'next/navigation'
import { z } from 'zod'

import { getAuth } from '@/lib/auth/server'
import { bindInvite, getPendingInvite } from '@/lib/data'
import { inviteTokenMatches } from '@/lib/invite-token'
import { clientIp, isThrottled, recordAttempt, type ThrottleRule } from '@/lib/throttle'

export type AuthState = { error: string } | null

const credentials = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email.').max(200),
  password: z.string().min(8, 'Use at least 8 characters for your password.').max(200),
})

const INVALID_INVITE = 'This invite link is not valid for that email, or it has expired. Ask Aslam for a new one.'

/**
 * True when `token` is the live link for an unredeemed invite to `email`.
 * Every failure looks the same to the caller, so the form cannot be used to
 * learn which emails are invited.
 */
async function inviteIsRedeemable(email: string, token: string): Promise<boolean> {
  const invite = await getPendingInvite(email)
  if (!invite || invite.user_id || !invite.token_expires_at) return false
  if (new Date(invite.token_expires_at).getTime() <= Date.now()) return false
  return inviteTokenMatches(token, invite.token_hash)
}

function inviteToken(form: FormData): string {
  const value = form.get('invite')
  return typeof value === 'string' ? value.trim() : ''
}

const TOO_MANY = 'Too many attempts. Wait 15 minutes and try again.'

/** Failed sign-ins: 10 per email and 30 per IP in 15 minutes. */
const signInRules = (email: string, ip: string): ThrottleRule[] => [
  { scope: 'sign-in:email', subject: email, max: 10, windowMinutes: 15 },
  { scope: 'sign-in:ip', subject: ip, max: 30, windowMinutes: 15 },
]

export async function signIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const parsed = credentials.safeParse({ email: form.get('email'), password: form.get('password') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check your details.' }

  const rules = signInRules(parsed.data.email, await clientIp())
  if (await isThrottled(rules)) return { error: TOO_MANY }

  // An invite link opened by someone who already has an account: check it
  // before signing in, so a bad link changes nothing.
  const token = inviteToken(form)
  if (token && !(await inviteIsRedeemable(parsed.data.email, token))) {
    await recordAttempt(rules)
    return { error: INVALID_INVITE }
  }

  const { data, error } = await getAuth().signIn.email(parsed.data)
  if (error || !data?.user?.id) {
    await recordAttempt(rules)
    return { error: 'That email and password did not match.' }
  }

  if (token) await bindInvite(parsed.data.email, data.user.id)
  redirect('/edit')
}

/**
 * Account creation, by invite link only. The link is checked here before
 * the auth server is asked to create anything, and the new account's id is
 * bound to the invite; lib/session.ts admits nobody else. The public sign-up
 * endpoint is also blocked in app/api/auth.
 */
export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const parsed = credentials
    .extend({ name: z.string().trim().min(1, 'Enter your name.').max(80) })
    .safeParse({ email: form.get('email'), password: form.get('password'), name: form.get('name') })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check your details.' }

  // Each try costs one: guessing links or emails is bounded per IP.
  const rules: ThrottleRule[] = [{ scope: 'sign-up:ip', subject: await clientIp(), max: 10, windowMinutes: 60 }]
  if (await isThrottled(rules)) return { error: TOO_MANY }
  await recordAttempt(rules)

  if (!(await inviteIsRedeemable(parsed.data.email, inviteToken(form)))) return { error: INVALID_INVITE }

  const { data, error } = await getAuth().signUp.email(parsed.data)
  if (error || !data?.user?.id) {
    return {
      error: error?.message?.includes('exist')
        ? 'An account with that email already exists. Use Sign in with this same link to join.'
        : 'Could not create the account. Try again.',
    }
  }
  if (!(await bindInvite(parsed.data.email, data.user.id))) return { error: INVALID_INVITE }
  redirect('/edit')
}

export async function signOut() {
  await getAuth().signOut()
  redirect('/login')
}
