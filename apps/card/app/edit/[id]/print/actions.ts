'use server'

import { randomUUID } from 'node:crypto'

import { updateTag } from 'next/cache'

import { newTagId, TAGS_CACHE_TAG } from '@/lib/card/tags'
import { createTag, getProfile, saveDesign } from '@/lib/data'
import { designSchema } from '@/lib/design/schema'
import { requireMember } from '@/lib/session'
import { IMAGE_TYPES, isMediaUrl, MAX_IMAGE_BYTES, putImage, sniffImageType } from '@/lib/storage'

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string }

export async function saveCardDesign(profileId: string, input: unknown): Promise<Result> {
  const member = await requireMember()
  const parsed = designSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid design.' }

  const images = (['front', 'back'] as const).flatMap((s) => [
    parsed.data[s].background.image,
    ...parsed.data[s].elements.flatMap((e) => (e.type === 'image' ? [e.src] : [])),
  ])
  if (images.some((u) => u && !isMediaUrl(u))) return { ok: false, error: 'Images must be uploaded through the designer.' }

  return (await saveDesign(profileId, member.id, parsed.data)) ? { ok: true } : { ok: false, error: 'Card not found.' }
}

/**
 * Print images are kept large (the browser resizes to at most 2400px, about
 * 700 dpi across a card) because print needs far more pixels than a screen.
 */
export async function uploadPrintImage(profileId: string, form: FormData): Promise<Result<{ url: string }>> {
  const member = await requireMember()
  if (!(await getProfile(profileId, member.id))) return { ok: false, error: 'Card not found.' }
  const file = form.get('file')
  if (!(file instanceof File)) return { ok: false, error: 'No file received.' }
  if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: 'Images must be under 2 MB after resizing.' }
  const bytes = new Uint8Array(await file.arrayBuffer())
  const type = sniffImageType(bytes)
  if (!type) return { ok: false, error: 'Use a JPEG, PNG or WebP image.' }
  try {
    const url = await putImage(`${member.id}/${profileId}/print-${randomUUID()}.${IMAGE_TYPES[type]}`, bytes, type)
    return { ok: true, url }
  } catch (err) {
    console.error('Print image upload failed', err)
    return { ok: false, error: 'Upload failed. Try again.' }
  }
}

/** A new NFC tag link for this card, so the printed QR matches the chip. */
export async function createPrintTag(profileId: string): Promise<Result<{ id: string }>> {
  const member = await requireMember()
  if (!(await getProfile(profileId, member.id))) return { ok: false, error: 'Card not found.' }
  const id = newTagId()
  await createTag(id, 'Printed card', profileId)
  updateTag(TAGS_CACHE_TAG)
  return { ok: true, id }
}
