'use server'

import { z } from 'zod'

import { getAuth } from '@/lib/auth/server'
import { siteUrl } from '@/lib/env'

export type ResetState = { status: 'idle' } | { status: 'sent' } | { status: 'done' } | { status: 'error'; message: string }

/**
 * Step 1: email a reset link. The response is the same whether or not the
 * email has an account, so the form cannot be used to find out who is
 * signed up. Links expire after 15 minutes (Managed Better Auth default).
 */
export async function requestReset(_prev: ResetState, form: FormData): Promise<ResetState> {
  const email = z.string().trim().toLowerCase().email().safeParse(form.get('email'))
  if (!email.success) return { status: 'error', message: 'Enter a valid email.' }

  try {
    await getAuth().requestPasswordReset({ email: email.data, redirectTo: `${siteUrl()}/login/reset` })
  } catch (err) {
    console.error('Password reset request failed', err)
  }
  return { status: 'sent' }
}

/** Step 2: set the new password using the token from the emailed link. */
export async function completeReset(_prev: ResetState, form: FormData): Promise<ResetState> {
  const parsed = z
    .object({
      token: z.string().min(10).max(500),
      password: z.string().min(8, 'Use at least 8 characters.').max(200),
      confirm: z.string(),
    })
    .refine((v) => v.password === v.confirm, { message: 'The two passwords do not match.' })
    .safeParse({ token: form.get('token'), password: form.get('password'), confirm: form.get('confirm') })
  if (!parsed.success) return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Check the form.' }

  const { error } = await getAuth().resetPassword({ newPassword: parsed.data.password, token: parsed.data.token })
  if (error) {
    return { status: 'error', message: 'This reset link has expired or was already used. Request a new one.' }
  }
  return { status: 'done' }
}
