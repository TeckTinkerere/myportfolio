'use server'

import { revalidatePath, updateTag } from 'next/cache'

import { newTagId, TAG_PATTERN, TAGS_CACHE_TAG } from '@/lib/card/tags'
import { createTag, deleteCardTag, getProfile, getTag } from '@/lib/data'
import { requireMember } from '@/lib/session'

/**
 * NFC actions for one card. Owners manage tags for their own cards; admins
 * can also see where any tag points when they scan it.
 */

export async function createCardTag(
  profileId: string,
  label: string,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const member = await requireMember()
  if (!(await getProfile(profileId, member.id))) return { ok: false, error: 'Card not found.' }
  const id = newTagId()
  await createTag(id, label.trim().slice(0, 60), profileId)
  revalidatePath(`/edit/${profileId}/nfc`)
  updateTag(TAGS_CACHE_TAG)
  return { ok: true, id }
}

export async function removeCardTag(profileId: string, tagId: string) {
  const member = await requireMember()
  if (!TAG_PATTERN.test(tagId)) return
  await deleteCardTag(tagId, profileId, member.id)
  revalidatePath(`/edit/${profileId}/nfc`)
  updateTag(TAGS_CACHE_TAG)
}

export type TagLookup =
  | { kind: 'unknown' }
  | { kind: 'unassigned' }
  | { kind: 'this-card'; label: string }
  | { kind: 'your-card'; handle: string; label: string }
  | { kind: 'someone-else' }

/** What a scanned /t/<id> tag points at, as far as this member may know. */
export async function lookupTag(profileId: string, tagId: string): Promise<TagLookup> {
  const member = await requireMember()
  if (!TAG_PATTERN.test(tagId)) return { kind: 'unknown' }
  const tag = await getTag(tagId)
  if (!tag) return { kind: 'unknown' }
  if (!tag.profile_id) return { kind: 'unassigned' }
  if (tag.profile_id === profileId && tag.owner_id === member.id) return { kind: 'this-card', label: tag.label }
  if (tag.owner_id === member.id || member.isAdmin) {
    return { kind: 'your-card', handle: tag.handle ?? '', label: tag.label }
  }
  return { kind: 'someone-else' }
}
