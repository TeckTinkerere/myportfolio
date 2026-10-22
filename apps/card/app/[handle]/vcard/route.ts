import { buildVCard, vcardFilename, type VCardPhoto } from '@/lib/card/vcard'
import { getPublishedCard } from '@/lib/data'
import { siteUrl } from '@/lib/env'
import { isMediaUrl } from '@/lib/storage'

/** The Save Contact download: a .vcf built from the published card. */
export async function GET(_req: Request, { params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const card = await getPublishedCard(handle.toLowerCase())
  if (!card) return new Response('Not found', { status: 404 })

  const vcf = buildVCard(card.doc, `${siteUrl()}/${card.handle}`, await loadPhoto(card.doc.header.photo))

  return new Response(vcf, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${vcardFilename(card.doc.header.name)}"`,
      'Cache-Control': 'public, max-age=0, s-maxage=300',
    },
  })
}

/** The profile photo inlined as base64, so it survives being saved offline. */
async function loadPhoto(url: string): Promise<VCardPhoto | undefined> {
  if (!url || !isMediaUrl(url)) return undefined
  try {
    // No redirects: the URL was checked, wherever it might bounce to was not.
    const res = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(5000) })
    if (!res.ok) return undefined
    const type = res.headers.get('content-type') ?? ''
    const kind = type.includes('png') ? 'PNG' : type.includes('webp') ? 'WEBP' : type.includes('jpeg') ? 'JPEG' : null
    if (!kind) return undefined
    const bytes = Buffer.from(await res.arrayBuffer())
    if (bytes.length > 1024 * 1024) return undefined
    return { type: kind, base64: bytes.toString('base64') }
  } catch {
    return undefined
  }
}
