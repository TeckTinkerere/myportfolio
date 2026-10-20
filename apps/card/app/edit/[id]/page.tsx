import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Builder } from '@/components/editor/builder'
import { Chrome } from '@/components/chrome'
import { cardSchema } from '@/lib/card/schema'
import { sameDoc } from '@/lib/card/stable'
import { getProfile } from '@/lib/data'
import { siteUrl } from '@/lib/env'
import { requireMember } from '@/lib/session'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Edit card' }

export default async function EditCard({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ delete?: string }>
}) {
  const member = await requireMember()
  const { id } = await params
  const { delete: deleteState } = await searchParams
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const profile = await getProfile(id, member.id)
  if (!profile) notFound()

  // A draft saved by an older schema still opens: parse fills defaults.
  const draft = cardSchema.safeParse(profile.draft)
  const doc = draft.success ? draft.data : cardSchema.parse({ header: { name: 'Untitled' }, theme: { background: {} }, meta: {} })

  return (
    <Chrome member={member}>
      <Builder
        id={profile.id}
        initialHandle={profile.handle}
        initialDoc={doc}
        isPublished={profile.published !== null}
        initialUnpublished={profile.published === null || !sameDoc(profile.published, profile.draft)}
        siteUrl={siteUrl()}
        deleteMismatch={deleteState === 'mismatch'}
      />
    </Chrome>
  )
}
