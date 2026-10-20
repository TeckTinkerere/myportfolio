'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { newTagId, TAG_PATTERN } from '@/lib/card/tags'
import { addInvite, assignTag, createTag, deleteTag, removeInvite } from '@/lib/data'
import { requireAdmin } from '@/lib/session'

const email = z.string().trim().toLowerCase().email()
const uuid = z.string().uuid()

export async function inviteAction(form: FormData) {
  await requireAdmin()
  const parsed = email.safeParse(form.get('email'))
  if (!parsed.success) return
  await addInvite(parsed.data, form.get('admin') === 'on')
  revalidatePath('/admin')
}

export async function uninviteAction(target: string) {
  const admin = await requireAdmin()
  // Never lock yourself out.
  if (target.toLowerCase() === admin.email.toLowerCase()) return
  await removeInvite(target)
  revalidatePath('/admin')
}

export async function createTagAction(form: FormData) {
  await requireAdmin()
  const label = String(form.get('label') ?? '').trim().slice(0, 60)
  const profile = String(form.get('profile') ?? '')
  await createTag(newTagId(), label, uuid.safeParse(profile).success ? profile : null)
  revalidatePath('/admin')
}

export async function assignTagAction(tagId: string, form: FormData) {
  await requireAdmin()
  if (!TAG_PATTERN.test(tagId)) return
  const profile = String(form.get('profile') ?? '')
  await assignTag(tagId, uuid.safeParse(profile).success ? profile : null)
  revalidatePath('/admin')
}

export async function deleteTagAction(tagId: string) {
  await requireAdmin()
  if (!TAG_PATTERN.test(tagId)) return
  await deleteTag(tagId)
  revalidatePath('/admin')
}
