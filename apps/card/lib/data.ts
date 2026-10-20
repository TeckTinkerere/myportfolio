import 'server-only'

import { cache } from 'react'

import { cardSchema, type CardDoc } from './card/schema'
import { sql } from './db'

/**
 * Every database query in the app. Functions that take an ownerId only ever
 * touch that owner's rows: ownership is part of the WHERE clause, not a
 * check done afterwards.
 */

export interface InviteRow {
  email: string
  is_admin: boolean
  invited_at: string
  accepted_at: string | null
}

export interface ProfileRow {
  id: string
  owner_id: string
  handle: string
  draft: CardDoc
  published: CardDoc | null
  published_at: string | null
  updated_at: string
}

export interface ProfileSummary {
  id: string
  handle: string
  name: string
  published_at: string | null
  has_unpublished: boolean
  lead_count: number
}

// ---------------------------------------------------------------- invites

export async function getInvite(email: string): Promise<InviteRow | null> {
  const rows = await sql`select * from invites where email = ${email}`
  return (rows[0] as InviteRow | undefined) ?? null
}

export async function markInviteAccepted(email: string) {
  await sql`update invites set accepted_at = now() where email = ${email} and accepted_at is null`
}

export async function listInvites(): Promise<InviteRow[]> {
  return (await sql`select * from invites order by invited_at`) as InviteRow[]
}

export async function addInvite(email: string, isAdmin: boolean) {
  await sql`insert into invites (email, is_admin) values (${email}, ${isAdmin})
            on conflict (email) do update set is_admin = excluded.is_admin`
}

export async function removeInvite(email: string) {
  await sql`delete from invites where email = ${email}`
}

// --------------------------------------------------------------- profiles

/**
 * The published card for a handle, or null. Re-validated on read.
 * Memoised per request: metadata, viewport and page all ask for it.
 */
export const getPublishedCard = cache(async function getPublishedCard(
  handle: string,
): Promise<{ id: string; handle: string; doc: CardDoc } | null> {
  const rows = await sql`select id, handle, published from profiles
                         where handle = ${handle} and published is not null`
  const row = rows[0] as { id: string; handle: string; published: unknown } | undefined
  if (!row) return null
  const parsed = cardSchema.safeParse(row.published)
  if (!parsed.success) {
    console.error(`Published card for ${handle} failed validation`, parsed.error.issues[0])
    return null
  }
  return { id: row.id, handle: row.handle, doc: parsed.data }
})

export async function listProfiles(ownerId: string): Promise<ProfileSummary[]> {
  return (await sql`
    select p.id, p.handle, p.draft->'header'->>'name' as name, p.published_at,
           (p.published is null or p.draft <> p.published) as has_unpublished,
           (select count(*)::int from leads l where l.profile_id = p.id) as lead_count
    from profiles p where p.owner_id = ${ownerId}
    order by p.created_at`) as ProfileSummary[]
}

export async function getProfile(id: string, ownerId: string): Promise<ProfileRow | null> {
  const rows = await sql`select * from profiles where id = ${id} and owner_id = ${ownerId}`
  return (rows[0] as ProfileRow | undefined) ?? null
}

export async function handleTaken(handle: string, exceptId?: string): Promise<boolean> {
  const rows = exceptId
    ? await sql`select 1 from profiles where handle = ${handle} and id <> ${exceptId}`
    : await sql`select 1 from profiles where handle = ${handle}`
  return rows.length > 0
}

export async function createProfile(ownerId: string, handle: string, doc: CardDoc): Promise<string> {
  const rows = await sql`insert into profiles (owner_id, handle, draft)
                         values (${ownerId}, ${handle}, ${JSON.stringify(doc)}::jsonb)
                         returning id`
  return (rows[0] as { id: string }).id
}

export async function saveDraft(id: string, ownerId: string, doc: CardDoc): Promise<boolean> {
  const rows = await sql`update profiles set draft = ${JSON.stringify(doc)}::jsonb, updated_at = now()
                         where id = ${id} and owner_id = ${ownerId} returning id`
  return rows.length > 0
}

/** Copies draft to published. Returns the handle, for revalidation. */
export async function publishProfile(id: string, ownerId: string): Promise<string | null> {
  const rows = await sql`update profiles set published = draft, published_at = now(), updated_at = now()
                         where id = ${id} and owner_id = ${ownerId} returning handle`
  return (rows[0] as { handle: string } | undefined)?.handle ?? null
}

export async function unpublishProfile(id: string, ownerId: string): Promise<string | null> {
  const rows = await sql`update profiles set published = null, published_at = null, updated_at = now()
                         where id = ${id} and owner_id = ${ownerId} returning handle`
  return (rows[0] as { handle: string } | undefined)?.handle ?? null
}

export async function renameHandle(id: string, ownerId: string, handle: string): Promise<boolean> {
  const rows = await sql`update profiles set handle = ${handle}, updated_at = now()
                         where id = ${id} and owner_id = ${ownerId} returning id`
  return rows.length > 0
}

export async function deleteProfile(id: string, ownerId: string): Promise<string | null> {
  const rows = await sql`delete from profiles where id = ${id} and owner_id = ${ownerId} returning handle`
  return (rows[0] as { handle: string } | undefined)?.handle ?? null
}

/** Owner email for a profile: where contact-form notifications go. */
export async function getOwnerEmail(profileId: string): Promise<string | null> {
  const rows = await sql`select u.email from profiles p join neon_auth."user" u on u.id = p.owner_id
                         where p.id = ${profileId}`
  return (rows[0] as { email: string } | undefined)?.email ?? null
}

// ------------------------------------------------------------------- tags

export interface TagRow {
  id: string
  label: string
  profile_id: string | null
  handle: string | null
  created_at: string
}

export async function resolveTag(id: string): Promise<string | null> {
  const rows = await sql`select p.handle from tags t join profiles p on p.id = t.profile_id
                         where t.id = ${id} and p.published is not null`
  return (rows[0] as { handle: string } | undefined)?.handle ?? null
}

export async function listTags(): Promise<TagRow[]> {
  return (await sql`select t.id, t.label, t.profile_id, p.handle, t.created_at
                    from tags t left join profiles p on p.id = t.profile_id
                    order by t.created_at`) as TagRow[]
}

export async function createTag(id: string, label: string, profileId: string | null) {
  await sql`insert into tags (id, label, profile_id) values (${id}, ${label}, ${profileId})`
}

export async function assignTag(id: string, profileId: string | null) {
  await sql`update tags set profile_id = ${profileId} where id = ${id}`
}

export async function deleteTag(id: string) {
  await sql`delete from tags where id = ${id}`
}

export async function listAllProfiles(): Promise<{ id: string; handle: string; email: string }[]> {
  return (await sql`select p.id, p.handle, u.email from profiles p
                    join neon_auth."user" u on u.id = p.owner_id order by p.handle`) as {
    id: string
    handle: string
    email: string
  }[]
}

// ------------------------------------------------------------------ leads

export interface LeadRow {
  id: string
  fields: Record<string, string>
  consent_text: string
  created_at: string
}

export async function insertLead(
  profileId: string,
  fields: Record<string, string>,
  consentText: string,
  senderHash: string,
) {
  await sql`insert into leads (profile_id, fields, consent_text, sender_hash)
            values (${profileId}, ${JSON.stringify(fields)}::jsonb, ${consentText}, ${senderHash})`
}

/** Submissions in the last hour, from one sender and to one profile. */
export async function recentLeadCounts(
  profileId: string,
  senderHash: string,
): Promise<{ sender: number; profile: number }> {
  const rows = await sql`
    select
      count(*) filter (where sender_hash = ${senderHash})::int as sender,
      count(*) filter (where profile_id = ${profileId})::int as profile
    from leads where created_at > now() - interval '1 hour'`
  return rows[0] as { sender: number; profile: number }
}

export async function listLeads(profileId: string, ownerId: string): Promise<LeadRow[]> {
  return (await sql`select l.id, l.fields, l.consent_text, l.created_at
                    from leads l join profiles p on p.id = l.profile_id
                    where l.profile_id = ${profileId} and p.owner_id = ${ownerId}
                    order by l.created_at desc`) as LeadRow[]
}

export async function deleteLead(leadId: string, ownerId: string) {
  await sql`delete from leads l using profiles p
            where l.id = ${leadId} and p.id = l.profile_id and p.owner_id = ${ownerId}`
}
