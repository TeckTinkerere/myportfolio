import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Chrome } from '@/components/chrome'
import { Studio } from '@/components/design/studio'
import { cardSchema } from '@/lib/card/schema'
import { getDesign, getProfile, listCardTags } from '@/lib/data'
import { designSchema } from '@/lib/design/schema'
import { defaultDesign } from '@/lib/design/templates'
import { siteUrl } from '@/lib/env'
import { requireMember } from '@/lib/session'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Print design' }

/**
 * Design the physical card, front and back, and export print-ready files.
 * Text can follow the digital card's fields, so the print stays in step.
 */
export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const member = await requireMember()
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const profile = await getProfile(id, member.id)
  if (!profile) notFound()

  const [saved, tags] = await Promise.all([getDesign(id, member.id), listCardTags(id, member.id)])
  const parsedSaved = saved ? designSchema.safeParse(saved) : null
  const design = parsedSaved?.success ? parsedSaved.data : defaultDesign()

  // The latest card details, published or not: the owner is designing
  // what they are about to print.
  const card = cardSchema.safeParse(profile.draft)
  const header = card.success ? card.data.header : { name: '', title: '', company: '', phone: '', email: '', website: '' }
  const base = siteUrl()

  return (
    <Chrome member={member}>
      <Studio
        profileId={id}
        handle={profile.handle}
        initial={design}
        initialTags={tags.map((t) => ({ id: t.id, label: t.label }))}
        ctx={{
          card: {
            name: header.name,
            title: header.title,
            company: header.company,
            phone: header.phone,
            email: header.email,
            website: header.website,
          },
          cardUrl: `${base}/${profile.handle}`,
          siteUrl: base,
        }}
      />
    </Chrome>
  )
}
