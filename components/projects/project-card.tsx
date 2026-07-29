import Image from 'next/image'
import Link from 'next/link'

import { StatusBadge } from '@/components/projects/status-badge'
import type { PortfolioProject } from '@/lib/content/schema'
import { cn } from '@/lib/utils'

/**
 * Everything essential is visible without hovering: proof verb, title,
 * one-line result, role and status. Hover only lifts the frame and reveals
 * the affordance — it never carries information that exists nowhere else.
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
        'panel group relative flex h-full flex-col rounded-sm transition-colors hover:border-border-strong',
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
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="label-mono text-accent">{project.proofVerb}</span>
          <StatusBadge status={project.status} />
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold text-ink">
          {/* Stretched link keeps the whole card clickable without nesting
              interactive elements inside one another. */}
          <Link href={`/work/${project.slug}`} className="after:absolute after:inset-0">
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{project.oneLiner}</p>

        <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-1 border-t border-border pt-3 text-xs text-ink-muted">
          <div className="flex gap-1.5">
            <dt className="sr-only">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Timeframe</dt>
            <dd className="tnum">{project.timeframeLabel}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
