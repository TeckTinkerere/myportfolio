import { ArrowUpRight, Download, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Section } from '@/components/layout/section'
import { PrintButton } from '@/components/profile/print-button'
import { CommitteeList, EducationCard } from '@/components/profile/profile-blocks'
import {
  communicationEvidence,
  experience,
  experienceNote,
  featuredProjects,
  otherExperience,
  resumeEvidence,
  resumeHeadline,
  resumeLastUpdated,
  resumePdf,
  resumeSummary,
  technicalSkills,
  type FeaturedProject,
} from '@/content/profile'
import { siteConfig } from '@/content/site-config'
import { getRecognition } from '@/lib/content/queries'

/**
 * Engineering résumé. Written for a recruiter or engineering manager reading
 * for 30–90 seconds: identity, then experience, then evidence (projects),
 * then skills. Event and hosting work lives on the emcee site and is only
 * linked from here.
 *
 * All copy comes from content/data/profile.json (Keystatic → Profile &
 * résumé). Every claim on this page should be traceable to a project, a
 * repository or the internship; see docs/resume-audit.md.
 */

const title = 'Résumé — Software, Automation and Developer Tooling'
const description = `${siteConfig.legalName}: ${resumeHeadline}. Engineering internship at OCBC; projects in TypeScript, Python, Kotlin and React Native.`

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/resume' },
  openGraph: { title, description, url: '/resume', type: 'profile' },
  twitter: { card: 'summary_large_image', title, description },
}

const SKILL_LEVELS = [
  { key: 'strong', label: 'Strong working knowledge' },
  { key: 'practical', label: 'Used in projects' },
  { key: 'exposure', label: 'Exposure' },
] as const

export default function ResumePage() {
  // Competitive placings only, best first. Course completions stay on /about.
  const placements = getRecognition()
    .filter((item) => item.placement)
    .sort((a, b) => parseInt(a.placement!, 10) - parseInt(b.placement!, 10))

  return (
    <div className="resume">
      <Hero />

      <Section id="experience" aria-labelledby="experience-heading" className="scroll-mt-16 pb-0">
        <Heading id="experience-heading" eyebrow="Experience" title="Experience" />
        <ol className="space-y-4 print:space-y-3">
          {experience.map((item) => (
            <li
              key={`${item.organisation}-${item.role}`}
              className="panel rounded-sm p-5 sm:p-6 print:break-inside-avoid print:border-0 print:p-0"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-display text-lg font-semibold text-ink">
                  {item.role}
                  <span className="font-normal text-ink-muted"> · {item.organisation}</span>
                </h3>
                <p className="label-mono tnum text-ink-muted">{item.timeframe}</p>
              </div>
              <p className="mt-1.5 text-sm text-ink-muted">{item.summary}</p>
              {item.highlights.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ink">
                  {item.highlights.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-ink-muted">{experienceNote}</p>
        {otherExperience.length > 0 ? (
          <div className="mt-6">
            <h3 className="label-mono text-ink-muted">Other work</h3>
            <ul className="mt-2 space-y-1 text-sm text-ink-muted">
              {otherExperience.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>

      <Section id="projects" aria-labelledby="projects-heading" className="scroll-mt-16 pb-0">
        <Heading
          id="projects-heading"
          eyebrow="Projects"
          title="Selected engineering projects"
          action={
            <Link href="/work" className="label-mono text-accent underline-offset-4 hover:underline">
              All work →
            </Link>
          }
        />
        <ol className="space-y-4 print:space-y-3">
          {featuredProjects.map((project) => (
            <ProjectEntry key={project.name} project={project} />
          ))}
        </ol>
      </Section>

      <Section id="skills" aria-labelledby="skills-heading" className="scroll-mt-16 pb-0">
        <Heading id="skills-heading" eyebrow="Skills" title="Technical skills" />
        <p className="mb-4 max-w-prose text-sm text-ink-muted">
          Grouped by depth of use rather than self-rated mastery. Strong means used repeatedly in
          the internship or across several of the projects above.
        </p>
        <div className="panel overflow-hidden rounded-sm print:border-0">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="sr-only">Technical skills by area and depth</caption>
            <thead className="hidden bg-surface-raised md:table-header-group print:table-header-group">
              <tr>
                <th scope="col" className="label-mono w-48 p-4 font-normal text-ink-muted">
                  Area
                </th>
                {SKILL_LEVELS.map((level) => (
                  <th key={level.key} scope="col" className="label-mono p-4 font-normal text-ink-muted">
                    {level.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {technicalSkills.map((group) => (
                <tr
                  key={group.group}
                  className="block border-t border-border first:border-t-0 md:table-row md:first:border-t print:table-row"
                >
                  <th
                    scope="row"
                    className="block px-4 pt-4 font-display font-semibold text-ink md:table-cell md:align-top md:pb-4 print:table-cell"
                  >
                    {group.group}
                  </th>
                  {SKILL_LEVELS.map((level) => (
                    <td
                      key={level.key}
                      className={`${group[level.key].length > 0 ? 'block' : 'hidden'} px-4 pb-1 pt-1 align-top text-ink last:pb-4 md:table-cell md:py-4 print:table-cell`}
                    >
                      <span className="label-mono mr-2 text-ink-muted md:hidden print:hidden">
                        {level.label}:
                      </span>
                      {group[level.key].length > 0 ? (
                        group[level.key].join(', ')
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section aria-labelledby="education-heading" className="pb-0">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Heading id="education-heading" eyebrow="Education" title="Education" />
            <EducationCard />
          </div>
          <div>
            <Heading id="awards-heading" eyebrow="Recognition" title="Competition placings" />
            <ul className="space-y-3">
              {placements.map((item) => (
                <li key={item.slug} className="panel rounded-sm p-4 print:border-0 print:p-0">
                  <p className="text-sm text-ink">
                    <span className="font-semibold text-accent">{item.placement}</span> ·{' '}
                    {item.title}
                  </p>
                  <p className="label-mono tnum mt-1 text-ink-muted">
                    {item.issuer} · {item.date.slice(0, 4)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section aria-labelledby="communication-heading" className="pb-0">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Heading
              id="communication-heading"
              eyebrow="Communication"
              title="Teaching, documentation and facilitation"
            />
            <ul className="space-y-2 text-sm leading-relaxed text-ink">
              {communicationEvidence.map((point) => (
                <li key={point} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-muted print:hidden">
              I also host and emcee technology events.{' '}
              <a
                href={siteConfig.emceeUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-accent underline-offset-4 hover:underline"
              >
                Event portfolio → {siteConfig.emceeUrl.replace('https://', '')}
              </a>
            </p>
          </div>
          <div>
            <Heading id="committees-heading" eyebrow="Leadership" title="Committees" />
            <CommitteeList />
          </div>
        </div>
      </Section>

      <Section id="contact" aria-labelledby="contact-heading" className="scroll-mt-16">
        <Heading id="contact-heading" eyebrow="Contact" title="Get in touch" />
        <ContactLinks />
        <p className="label-mono mt-10 text-ink-muted">Last updated {resumeLastUpdated}</p>
      </Section>
    </div>
  )
}

function ProjectEntry({ project }: { project: FeaturedProject }) {
  return (
    <li className="panel rounded-sm p-5 sm:p-6 print:break-inside-avoid print:border-0 print:p-0">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <p className="label-mono text-accent">{project.kind}</p>
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">{project.name}</h3>
        </div>
        <ul className="flex flex-wrap gap-2 print:hidden">
          {project.links.map((link) => {
            const external = link.href.startsWith('http')
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs text-ink transition-colors hover:border-border-strong hover:bg-surface-raised"
                >
                  {link.label === 'GitHub' ? <Github aria-hidden className="size-3.5" /> : null}
                  {link.label}
                  {external ? <ArrowUpRight aria-hidden className="size-3.5 text-ink-muted" /> : null}
                  {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink">{project.description}</p>

      <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[8.5rem_1fr]">
        <dt className="label-mono pt-0.5 text-ink-muted">Role</dt>
        <dd className="text-ink">{project.role}</dd>

        <dt className="label-mono pt-0.5 text-ink-muted">Problem</dt>
        <dd className="text-ink">{project.challenge}</dd>

        <dt className="label-mono pt-0.5 text-ink-muted">Built</dt>
        <dd>
          <ul className="space-y-1.5 text-ink">
            {project.built.map((point) => (
              <li key={point} className="flex gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </dd>

        <dt className="label-mono pt-0.5 text-ink-muted">Key decision</dt>
        <dd className="text-ink">{project.decision}</dd>

        <dt className="label-mono pt-0.5 text-ink-muted">Outcome</dt>
        <dd className="text-ink">{project.outcome}</dd>

        <dt className="label-mono pt-0.5 text-ink-muted">Stack</dt>
        <dd className="text-ink-muted">{project.stack.join(' · ')}</dd>
      </dl>
    </li>
  )
}

function Hero() {
  return (
    <div className="border-b border-border print:border-0">
      <Section className="pb-10 pt-10 sm:pt-14 print:py-0">
        <p className="label-mono text-accent print:hidden">Résumé</p>
        {/* The one place the full legal name is appropriate (PRD FR-08). */}
        <h1 className="mt-3 font-display text-headline font-semibold text-ink sm:text-display print:mt-0 print:text-3xl">
          {siteConfig.legalName}
        </h1>
        <p className="mt-3 max-w-3xl text-lg font-medium text-ink print:text-sm">{resumeHeadline}</p>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted print:text-sm">
          {resumeSummary}
        </p>

        <ul className="mt-6 grid max-w-4xl gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3 print:hidden">
          {resumeEvidence.map((item) => {
            const external = item.href.startsWith('http')
            return (
              <li key={item.label} className="bg-surface">
                <a
                  href={item.href}
                  {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="block h-full p-4 transition-colors hover:bg-surface-raised"
                >
                  <span className="label-mono block text-accent">{item.label}</span>
                  <span className="mt-1 block text-sm text-ink">{item.text}</span>
                  {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </li>
            )
          })}
        </ul>

        <p className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
          <MapPin aria-hidden className="size-4 text-accent print:hidden" />
          {siteConfig.location}
          <span aria-hidden>·</span>
          <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-ink">
            {siteConfig.contact.email}
          </a>
        </p>

        <nav aria-label="Résumé actions" className="mt-6 flex flex-wrap gap-3 print:hidden">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
          >
            View projects
          </a>
          <a
            href="#experience"
            className="inline-flex items-center gap-2 rounded-sm border border-border-strong px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
          >
            View experience
          </a>
          <a
            href={siteConfig.contact.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-sm border border-border-strong px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
          >
            <Github aria-hidden className="size-4" />
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          {/*
            The download control appears once resumePdf is set in Keystatic.
            Until then the page itself is print-styled.
          */}
          {resumePdf ? (
            <a
              href={resumePdf.href}
              className="inline-flex items-center gap-2 rounded-sm border border-border-strong px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-raised"
            >
              <Download aria-hidden className="size-4" />
              Download PDF
            </a>
          ) : (
            <PrintButton />
          )}
        </nav>
      </Section>
    </div>
  )
}

function ContactLinks() {
  const links = [
    { icon: Mail, label: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
    { icon: Github, label: siteConfig.contact.github.replace('https://', ''), href: siteConfig.contact.github },
    { icon: Linkedin, label: 'LinkedIn', href: siteConfig.contact.linkedin },
  ]
  return (
    <ul className="flex flex-wrap gap-3">
      {links.map(({ icon: Icon, label, href }) => {
        const external = href.startsWith('http')
        return (
          <li key={href}>
            <a
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2.5 text-sm text-ink transition-colors hover:border-border-strong hover:bg-surface-raised"
            >
              <Icon aria-hidden className="size-4 text-accent print:hidden" />
              {label}
              {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
            </a>
          </li>
        )
      })}
      <li className="print:hidden">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
        >
          Contact form
        </Link>
      </li>
    </ul>
  )
}

function Heading({
  id,
  eyebrow,
  title,
  action,
}: {
  id: string
  eyebrow: string
  title: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 print:mb-2 print:border-b print:border-border print:pb-1">
      <div>
        <p className="label-mono mb-2 flex items-center gap-2.5 text-accent print:hidden">
          <span aria-hidden className="h-px w-6 bg-accent/60" />
          {eyebrow}
        </p>
        <h2 id={id} className="font-display text-title font-semibold text-ink print:text-base">
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0 print:hidden">{action}</div> : null}
    </div>
  )
}
