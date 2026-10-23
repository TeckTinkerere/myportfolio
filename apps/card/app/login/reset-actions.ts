'use server'

import { z } from 'zod'

import { getAuth } from '@/lib/auth/server'
import { siteUrl } from '@/lib/env'
import { clientIp, isThrottled, recordAttempt, type ThrottleRule } from '@/lib/throttle'

export type ResetState = { status: 'idle' } | { status: 'sent' } | { status: 'done' } | { status: 'error'; message: string }

/**
 * Step 1: email a reset link. The response is the same whether or not the
 * email has an account, so the form cannot be used to find out who is
 * signed up. Links expire after 15 minutes (Managed Better Auth default).
 *
 * Limited to 3 emails per address and 10 per IP an hour, so the form cannot
 * be used to flood someone's inbox. Over the limit it still says "sent".
 */
export async function requestReset(_prev: ResetState, form: FormData): Promise<ResetState> {
  const email = z.string().trim().toLowerCase().email().max(200).safeParse(form.get('email'))
  if (!email.success) return { status: 'error', message: 'Enter a valid email.' }

  const rules: ThrottleRule[] = [
    { scope: 'reset:email', subject: email.data, max: 3, windowMinutes: 60 },
    { scope: 'reset:ip', subject: await clientIp(), max: 10, windowMinutes: 60 },
  ]
  if (await isThrottled(rules)) return { status: 'sent' }
  await recordAttempt(rules)

  try {
    await getAuth().requestPasswordReset({ email: email.data, redirectTo: `${siteUrl()}/login/reset` })
  } catch (err) {
    console.error('Password reset request failed', err instanceof Error ? err.message : 'unknown error')
  }
  return { status: 'sent' }
}

/** Step 2: set the new password using the token from the emailed link. */
export async function completeReset(_prev: ResetState, form: FormData): Promise<ResetState> {
  const parsed = z
    .object({
      token: z.string().min(10).max(500),
      password: z.string().min(8, 'Use at least 8 characters.').max(200),
      confirm: z.string().max(200),
    })
    .refine((v) => v.password === v.confirm, { message: 'The two passwords do not match.' })
    .safeParse({ token: form.get('token'), password: form.get('password'), confirm: form.get('confirm') })
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Check the form.' }

  // Failed token guesses: 10 per IP in 15 minutes.
  const rules: ThrottleRule[] = [{ scope: 'reset-complete:ip', subject: await clientIp(), max: 10, windowMinutes: 15 }]
  if (await isThrottled(rules)) return { status: 'error', message: 'Too many attempts. Wait 15 minutes and try again.' }

  const { error } = await getAuth().resetPassword({ newPassword: parsed.data.password, token: parsed.data.token })
  if (error) {
    await recordAttempt(rules)
    return { status: 'error', message: 'This reset link has expired or was already used. Request a new one.' }
  }
  return { status: 'done' }
}
