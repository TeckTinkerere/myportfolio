import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Chrome } from '@/components/chrome'
import { NfcPanel } from '@/components/editor/nfc-panel'
import { listCardTags, getProfile } from '@/lib/data'
import { siteUrl } from '@/lib/env'
import { requireMember } from '@/lib/session'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'NFC' }

/**
 * Read and write NFC tags for one card, from the phone's browser. Writing
 * uses Web NFC, which only Chrome on Android supports; elsewhere the page
 * shows the tag URLs to write with an NFC app instead.
 */
export default async function NfcPage({ params }: { params: Promise<{ id: string }> }) {
  const member = await requireMember()
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  const profile = await getProfile(id, member.id)
  if (!profile) notFound()
  const tags = await listCardTags(id, member.id)

  return (
    <Chrome member={member}>
      <main className="mx-auto max-w-2xl px-4 py-10">
        <Link href={`/edit/${id}`} className="text-sm text-ink-muted hover:text-ink">
          ← Back to editor
        </Link>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">NFC</h1>
        <p className="text-ink-muted">
          Write <span className="font-mono">/{profile.handle}</span> onto a physical card, or check what a card holds.
          {!profile.published && ' This card is not published yet, so a tap will show "not set up" until you publish.'}
        </p>
        <NfcPanel
          profileId={id}
          handle={profile.handle}
          siteUrl={siteUrl()}
          tags={tags.map((t) => ({ id: t.id, label: t.label }))}
        />
      </main>
    </Chrome>
  )
}
