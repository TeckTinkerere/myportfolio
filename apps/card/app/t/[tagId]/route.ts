import { TAG_PATTERN } from '@/lib/card/tags'
import { resolveTag } from '@/lib/data'

/**
 * What an NFC chip opens: /t/<tagId> → /<handle>.
 *
 * 307, never 308: a permanent redirect would let phones and caches remember
 * the old target after a tag is moved to another card.
 */
export async function GET(req: Request, { params }: { params: Promise<{ tagId: string }> }) {
  const { tagId } = await params
  const id = tagId.toLowerCase()
  const handle = TAG_PATTERN.test(id) ? await resolveTag(id) : null
  const target = new URL(handle ? `/${handle}` : '/', req.url)
  if (!handle) target.searchParams.set('tag', 'unassigned')

  return new Response(null, {
    status: 307,
    headers: { Location: target.toString(), 'Cache-Control': 'no-store' },
  })
}
