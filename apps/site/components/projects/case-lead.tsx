import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { Tilt } from '@mohdaslam/ui/tilt'

import { LENS_ART } from '@/components/illustrations/art'
import { STATUS_LABELS } from '@/lib/content/public-view'
import type { PortfolioProject } from '@/lib/content/schema'

/**
 * The first thing on a case study: the work itself, in a window.
 *
 * Every project gets one, so no case study opens on bare text — but what is
 * inside the window is only ever what the record supports:
 *
 * - With a cover image, the screenshot, behind an address bar that links to
 *   the live site when a public one exists.
 * - Without one, a readout of the project's own outcomes beside the
 *   illustration for its discipline, behind a bar that links to the public
 *   repository when there is one.
 *
 * Nothing is generated or guessed to fill the frame. A project with no
 * screenshot, no repository and no outcomes written down gets no window.
 *
 * The window leans a few degrees toward the pointer. Kept slight on purpose:
 * it is a screenshot someone is trying to read.
 */

type Evidence = NonNullable<PortfolioProject['evidence']>[number]

/** "github.com/owner/repo" — what a person would read off an address bar. */
function displayUrl(href: string): string {
  try {
    const url = new URL(href)
    const path = url.pathname.replace(/\/$/, '')
    return `${url.hostname.replace(/^www\./, '')}${path}`
  } catch {
    return href
  }
}

export function CaseLead({
  project,
  evidence,
}: {
  project: PortfolioProject
  /** Already filtered to public links — see getPublicEvidence. */
  evidence: Evidence[]
}) {
  const liveSite = evidence.find((link) => link.type === 'live-site' || link.type === 'demo')
  const repository = evidence.find((link) => link.type === 'repository')

  const hasCover = Boolean(project.coverImage)
  const readout = project.outcomes.slice(0, 3)
  if (!hasCover && readout.length === 0) return null

  // A screenshot is of the running thing, so it points at the running thing.
  const address = hasCover ? (liveSite ?? repository) : (repository ?? liveSite)

  const fallbackLens = project.lenses.find((lens) => LENS_ART[lens])
  const Art = fallbackLens ? LENS_ART[fallbackLens] : undefined

  return (
    <Tilt className="mt-10" max={hasCover ? 2.5 : 3.5} perspective={1400}>
      <figure className="panel overflow-hidden rounded-sm shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3 border-b border-border bg-surface-raised px-4 py-2.5">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border-strong/50" />
            <span className="size-2.5 rounded-full bg-border-strong/50" />
            <span className="size-2.5 rounded-full bg-accent/70" />
          </span>
          {address ? (
            <a
              href={address.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex min-w-0 items-center gap-1.5 font-mono text-xs text-ink-muted hover:text-accent"
            >
              <span className="truncate">{displayUrl(address.href)}</span>
              <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
              <span className="sr-only">
                — {address.label} (opens in a new tab)
              </span>
            </a>
          ) : (
            <span className="label-mono text-ink-muted">{project.title}</span>
          )}
          <span className="label-mono ml-auto shrink-0 text-ink-muted">
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        {project.coverImage ? (
          <div className="relative aspect-[16/9] bg-surface-raised">
            <Image
              src={project.coverImage.src}
              alt={project.coverImage.alt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <div className="grid sm:grid-cols-[minmax(0,18rem)_1fr]">
            {Art ? (
              <div className="flex items-center justify-center border-b border-border bg-surface-raised px-10 py-8 sm:border-b-0 sm:border-r">
                <Art className="max-h-40 w-full" />
              </div>
            ) : null}
            <figcaption className={Art ? 'p-6 sm:p-8' : 'p-6 sm:col-span-2 sm:p-8'}>
              <p className="label-mono text-accent">Where it got to</p>
              <ul className="mt-4 grid gap-3">
                {readout.map((line) => (
                  <li key={line} className="flex gap-3 text-sm leading-relaxed text-ink">
                    <span aria-hidden className="label-mono mt-0.5 text-accent">
                      &gt;
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </figcaption>
          </div>
        )}
      </figure>
    </Tilt>
  )
}
