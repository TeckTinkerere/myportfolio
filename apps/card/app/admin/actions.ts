'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'

import { newTagId, TAG_PATTERN, TAGS_CACHE_TAG } from '@/lib/card/tags'
import { assignTag, createTag, deleteTag, removeInvite, upsertInvite } from '@/lib/data'
import { siteUrl } from '@/lib/env'
import { hashInviteToken, inviteExpiry, newInviteToken } from '@/lib/invite-token'
import { requireAdmin } from '@/lib/session'

const email = z.string().trim().toLowerCase().email().max(200)
const uuid = z.string().uuid()

export type InviteState =
  | { status: 'idle' }
  | { status: 'link'; email: string; url: string; expires: string }
  | { status: 'updated'; email: string }
  | { status: 'error'; message: string }

/**
 * Creates (or renews) an invite and returns its link, once. Only the hash
 * is stored, so this response is the only place the link exists.
 */
export async function inviteAction(_prev: InviteState, form: FormData): Promise<InviteState> {
  await requireAdmin()
  const parsed = email.safeParse(form.get('email'))
  if (!parsed.success) return { status: 'error', message: 'Enter a valid email.' }

  const token = newInviteToken()
  const expires = inviteExpiry()
  const { pending } = await upsertInvite(parsed.data, form.get('admin') === 'on', hashInviteToken(token), expires)
  revalidatePath('/admin')
  if (!pending) return { status: 'updated', email: parsed.data }
  return {
    status: 'link',
    email: parsed.data,
    url: `${siteUrl()}/login?invite=${token}`,
    expires: expires.toISOString(),
  }
}

export async function uninviteAction(target: string) {
  const admin = await requireAdmin()
  const parsed = email.safeParse(target)
  if (!parsed.success) return
  // Never lock yourself out.
  if (parsed.data === admin.email.toLowerCase()) return
  await removeInvite(parsed.data)
  revalidatePath('/admin')
}

export async function createTagAction(form: FormData) {
  await requireAdmin()
  const label = String(form.get('label') ?? '').trim().slice(0, 60)
  const profile = String(form.get('profile') ?? '')
  await createTag(newTagId(), label, uuid.safeParse(profile).success ? profile : null)
  revalidatePath('/admin')
  updateTag(TAGS_CACHE_TAG)
}

export async function assignTagAction(tagId: string, form: FormData) {
  await requireAdmin()
  if (!TAG_PATTERN.test(tagId)) return
  const profile = String(form.get('profile') ?? '')
  await assignTag(tagId, uuid.safeParse(profile).success ? profile : null)
  revalidatePath('/admin')
  updateTag(TAGS_CACHE_TAG)
}

export async function deleteTagAction(tagId: string) {
  await requireAdmin()
  if (!TAG_PATTERN.test(tagId)) return
  await deleteTag(tagId)
  revalidatePath('/admin')
  updateTag(TAGS_CACHE_TAG)
}
