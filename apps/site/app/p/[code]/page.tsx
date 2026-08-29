import { notFound, permanentRedirect } from 'next/navigation'

import { getShareCodes, resolveShareCode } from '@/lib/share/share-links'

/**
 * /p/<code> — the short link a QR encodes and a person reads aloud.
 *
 * It is a redirect, not a second rendering of the project. The case study at
 * /work/<slug> is already the public view, so pointing at it keeps one page
 * to maintain, one canonical URL for search engines, and no chance of a
 * "public" variant drifting out of step with the real one.
 *
 * Only published projects have codes, so this route generates exactly one
 * entry per publishable case study. dynamicParams = false means anything
 * else — a typo, a code for a project that has since been unpublished, an
 * invented string — is a 404 rendered by app/not-found.tsx, rather than a
 * lookup at request time.
 */
export function generateStaticParams() {
  return [...getShareCodes().values()].map((code) => ({ code }))
}

export const dynamicParams = false

export default async function ShortLinkPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  const slug = resolveShareCode(code)

  // Unreachable while dynamicParams is false, but the route's guarantee
  // should not depend on a config flag staying set.
  if (!slug) notFound()

  permanentRedirect(`/work/${slug}`)
}
