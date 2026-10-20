import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'

import { CardView } from '@/components/card/card-view'
import { getPublishedCard } from '@/lib/data'
import { siteUrl } from '@/lib/env'

/**
 * A public card: the page an NFC tap or QR scan lands on.
 *
 * Statically rendered on first request and cached until the owner
 * publishes again (publish calls revalidatePath). A tap is served from the
 * edge cache and never waits on the database. The hourly revalidate is a
 * backstop, not the update mechanism.
 */
export const revalidate = 3600

export function generateStaticParams() {
  return []
}

type Params = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params
  const card = await getPublishedCard(handle.toLowerCase())
  if (!card) return { title: 'Card not found' }
  const h = card.doc.header
  const m = card.doc.meta
  const title = m.title || [h.name, h.title].filter(Boolean).join(' | ')
  const description = m.description || [h.title, h.company].filter(Boolean).join(' at ') || `${h.name}'s card`
  const url = `${siteUrl()}/${card.handle}`
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: m.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'profile',
      url,
      title,
      description,
      images: h.photo ? [{ url: h.photo }] : undefined,
    },
    twitter: { card: 'summary', title, description },
  }
}

export async function generateViewport({ params }: Params): Promise<Viewport> {
  const { handle } = await params
  const card = await getPublishedCard(handle.toLowerCase())
  return { themeColor: card?.doc.theme.background.from ?? '#0f172a' }
}

export default async function CardPage({ params }: Params) {
  const { handle } = await params
  const card = await getPublishedCard(handle.toLowerCase())
  if (!card) notFound()

  return (
    <div className="flex min-h-dvh justify-center" style={{ background: card.doc.theme.background.to }}>
      <div className="min-h-dvh w-full max-w-[480px] shadow-2xl shadow-black/30">
        <CardView doc={card.doc} handle={card.handle} url={`${siteUrl()}/${card.handle}`} />
      </div>
    </div>
  )
}
