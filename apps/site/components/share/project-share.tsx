import { ShareLauncher } from '@/components/share/share-launcher'
import { getShareUrl } from '@/lib/share/share-links'

/**
 * Server half of the share control: resolves the short link and hands the
 * launcher three short strings.
 *
 * Keeping the split here is what lets lib/share/share-links stay server-only
 * — a client component can never reach the code map, and the map itself
 * never crosses into a payload. It also means an unpublished project cannot
 * render a share button by accident: getShareUrl() returns undefined for
 * anything getPublicProjects() does not return, and this renders nothing.
 */
export function ProjectShare({
  slug,
  title,
  variant = 'button',
  className,
}: {
  slug: string
  title: string
  variant?: 'button' | 'icon'
  className?: string
}) {
  const shareUrl = getShareUrl(slug)
  if (!shareUrl) return null

  return (
    <ShareLauncher
      title={title}
      shareUrl={shareUrl}
      canonicalPath={`/work/${slug}`}
      variant={variant}
      className={className}
    />
  )
}
