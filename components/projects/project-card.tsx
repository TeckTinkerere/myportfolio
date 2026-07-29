import Image from 'next/image'
import Link from 'next/link'

import { StatusBadge } from '@/components/projects/status-badge'
import type { PortfolioProject } from '@/lib/content/schema'
import { cn } from '@/lib/utils'

/**
 * Everything essential is visible without hovering (PRD s15.6): proof verb,
 * title, one-line result, role and status. Hover only lifts the border.
 */
export function ProjectCard({
  project,
  featured = false,
}: {
  project: PortfolioProject
  featured?: boolean
}) {
  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-accent/60',
        featured && 'sm:flex-row',
      )}
    >
      {project.coverImage ? (
        <div
          className={cn(
            'relative aspect-[16/9] w-full shrink-0 overflow-hidden border-b border-border bg-surface-raised',
            featured && 'sm:aspect-[4/3] sm:w-2/5 sm:border-b-0 sm:border-r',
          )}
        >
          <Image
            src={project.coverImage.src}
            alt={project.coverImage.alt}
            fill
            sizes={featured ? '(max-width: 640px) 100vw, 40vw' : '(max-width: 768px) 100vw, 33vw'}
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="label-mono text-accent">{project.proofVerb}</span>
          <StatusBadge status={project.status} />
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">
          {/* Stretched link keeps the whole card clickable without nesting
              interactive elements. */}
          <Link href={`/work/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.oneLiner}</p>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-ink-muted">
          <div className="flex gap-1.5">
            <dt className="sr-only">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Timeframe</dt>
            <dd>{project.timeframeLabel}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
