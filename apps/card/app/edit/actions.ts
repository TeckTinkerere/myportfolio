'use server'

import { randomUUID } from 'node:crypto'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { newCard } from '@/lib/card/defaults'
import { handleProblem, normaliseHandle } from '@/lib/card/handles'
import { cardImages, cardSchema, firstIssue } from '@/lib/card/schema'
import {
  createProfile,
  deleteLead,
  deleteProfile,
  getProfile,
  handleTaken,
  publishProfile,
  renameHandle,
  saveDraft,
  unpublishProfile,
} from '@/lib/data'
import { requireMember } from '@/lib/session'
import { IMAGE_TYPES, isMediaUrl, MAX_IMAGE_BYTES, putImage, sniffImageType } from '@/lib/storage'

/**
 * Every editor write. Each one starts with requireMember() and passes the
 * member's id down, so a request can only ever touch its own cards.
 */

export type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string }

export type CreateState = { error: string } | null

export async function createCard(_prev: CreateState, form: FormData): Promise<CreateState> {
  const member = await requireMember()
  const handle = normaliseHandle(String(form.get('handle') ?? ''))
  const name = String(form.get('name') ?? '').trim()

  const problem = handleProblem(handle)
  if (problem) return { error: problem }
  if (!name) return { error: 'Enter the name to show on the card.' }
  if (await handleTaken(handle)) return { error: `${handle} is already taken.` }

  const id = await createProfile(member.id, handle, newCard(name.slice(0, 80)))
  redirect(`/edit/${id}`)
}

export async function saveCard(id: string, input: unknown): Promise<Result<{ savedAt: string }>> {
  const member = await requireMember()
  const parsed = cardSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error) }
  if (cardImages(parsed.data).some((u) => !isMediaUrl(u))) {
    return { ok: false, error: 'Images must be uploaded through the editor.' }
  }
  const saved = await saveDraft(id, member.id, parsed.data)
  if (!saved) return { ok: false, error: 'Card not found.' }
  return { ok: true, savedAt: new Date().toISOString() }
}

/** Copies the saved draft live. The editor saves before calling this. */
export async function publishCard(id: string): Promise<Result<{ handle: string }>> {
  const member = await requireMember()
  const profile = await getProfile(id, member.id)
  if (!profile) return { ok: false, error: 'Card not found.' }
  const parsed = cardSchema.safeParse(profile.draft)
  if (!parsed.success) return { ok: false, error: `Fix this before publishing. ${firstIssue(parsed.error)}` }

  const handle = await publishProfile(id, member.id)
  if (!handle) return { ok: false, error: 'Card not found.' }
  revalidatePath(`/${handle}`)
  return { ok: true, handle }
}

export async function unpublishCard(id: string): Promise<Result> {
  const member = await requireMember()
  const handle = await unpublishProfile(id, member.id)
  if (!handle) return { ok: false, error: 'Card not found.' }
  revalidatePath(`/${handle}`)
  return { ok: true }
}

export async function renameCard(id: string, rawHandle: string): Promise<Result<{ handle: string }>> {
  const member = await requireMember()
  const handle = normaliseHandle(rawHandle)
  const problem = handleProblem(handle)
  if (problem) return { ok: false, error: problem }

  const profile = await getProfile(id, member.id)
  if (!profile) return { ok: false, error: 'Card not found.' }
  if (profile.handle === handle) return { ok: true, handle }
  if (await handleTaken(handle, id)) return { ok: false, error: `${handle} is already taken.` }

  await renameHandle(id, member.id, handle)
  // The old path must stop serving the card; NFC tags follow automatically
  // because they point at the profile, not the handle.
  revalidatePath(`/${profile.handle}`)
  revalidatePath(`/${handle}`)
  return { ok: true, handle }
}

export async function deleteCard(id: string, form: FormData) {
  const member = await requireMember()
  const profile = await getProfile(id, member.id)
  if (!profile) redirect('/edit')
  if (normaliseHandle(String(form.get('confirm') ?? '')) !== profile.handle) {
    redirect(`/edit/${id}?delete=mismatch`)
  }
  await deleteProfile(id, member.id)
  revalidatePath(`/${profile.handle}`)
  redirect('/edit')
}

const IMAGE_KINDS = new Set(['photo', 'banner', 'logo'])

export async function uploadImage(id: string, kind: string, form: FormData): Promise<Result<{ url: string }>> {
  const member = await requireMember()
  if (!IMAGE_KINDS.has(kind)) return { ok: false, error: 'Unknown image.' }
  if (!(await getProfile(id, member.id))) return { ok: false, error: 'Card not found.' }

  const file = form.get('file')
  if (!(file instanceof File)) return { ok: false, error: 'No file received.' }
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: 'Images must be under 2 MB.' }

  const bytes = new Uint8Array(await file.arrayBuffer())
  // Trust the bytes, not the file name or the browser's claimed type.
  const type = sniffImageType(bytes)
  if (!type) return { ok: false, error: 'Use a JPEG, PNG or WebP image.' }

  const key = `${member.id}/${id}/${kind}-${randomUUID()}.${IMAGE_TYPES[type]}`
  try {
    const url = await putImage(key, bytes, type)
    return { ok: true, url }
  } catch (err) {
    console.error('Image upload failed', err)
    return { ok: false, error: 'Upload failed. Try again.' }
  }
}

export async function removeLead(profileId: string, leadId: string) {
  const member = await requireMember()
  await deleteLead(leadId, member.id)
  revalidatePath(`/edit/${profileId}/inbox`)
}
