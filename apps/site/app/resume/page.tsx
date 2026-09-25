import {
  ArrowUpRight,
  Download,
  Github,
  Hammer,
  Linkedin,
  Mail,
  MapPin,
  Radio,
} from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { LENS_ART } from '@/components/illustrations/art'
import { Section } from '@/components/layout/section'
import { buildCareerLanes } from '@/components/profile/career-lanes'
import { CareerTrack } from '@/components/profile/career-track'
import { PrintButton } from '@/components/profile/print-button'
import {
  CapabilityGroups,
  CommitteeList,
  EducationCard,
} from '@/components/profile/profile-blocks'
import { GridBackdrop } from '@/components/system/panel'
import { experience, resumeLastUpdated, resumePdf } from '@/content/profile'
import { siteConfig } from '@/content/site-config'
import {
  getFeaturedProjects,
  getPublicEvents,
  getPublicProjects,
  getRecognition,
} from '@/lib/content/queries'

export const metadata: Metadata = {
  title: 'Résumé',
  description: `Résumé for ${siteConfig.legalName} — technology builder based in Singapore.`,
  alternates: { canonical: '/resume' },
}

/** Whole months between two YYYY-MM values; an open end means "now". */
function monthsBetween(start: string, end: string | null) {
  const [sy, sm] = start.split('-').map(Number)
  const now = new Date()
  const [ey, em] = end ? end.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1]
  return (ey! - sy!) * 12 + (em! - sm!) + 1
}

function formatSpan(months: number) {
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [years ? `${years} yr` : '', rest ? `${rest} mo` : ''].filter(Boolean).join(' ')
}

export default function ResumePage() {
  // Best placing first: "1st place" before "2nd place".
  const placements = getRecognition()
    .filter((item) => item.placement)
    .sort((a, b) => parseInt(a.placement!, 10) - parseInt(b.placement!, 10))
  const events = getPublicEvents()
  const projects = getPublicProjects()
  const featured = getFeaturedProjects('general', 3)

  // Earliest build role, so "building since" is read off the record.
  const buildingSince = experience
    .filter((item) => item.kind === 'build')
    .map((item) => item.start)
    .sort()[0]
    ?.slice(0, 4)

  const stats = [
    { value: String(projects.length), label: 'Published projects' },
    { value: String(events.length), label: 'Events worked' },
    { value: String(placements.length), label: 'Competition placings' },
    ...(buildingSince ? [{ value: buildingSince, label: 'Building since' }] : []),
  ]

  return (
    <div className="resume">
      <Hero stats={stats} />

      <Section aria-labelledby="track-heading" className="pb-0 print:hidden">
        <Heading id="track-heading" eyebrow="At a glance" title="Career track" />
        <CareerTrack
          caption="Positioned from real dates. Diamonds are events; filled ones I hosted."
          lanes={buildCareerLanes()}
        />
      </Section>

      <Section aria-labelledby="experience-heading" className="pb-0">
        <Heading id="experience-heading" eyebrow="Experience" title="Where I’ve worked" />
        <ol className="grid gap-4 md:grid-cols-2 print:grid-cols-1 print:gap-3">
          {experience.map((item) => {
            const Icon = item.kind === 'build' ? Hammer : Radio
            return (
              <li
                key={`${item.organisation}-${item.role}`}
                className="panel flex gap-4 rounded-sm p-5 print:border-0 print:p-0"
              >
                <span
                  className={
                    item.kind === 'build'
                      ? 'flex size-11 shrink-0 items-center justify-center rounded-sm border border-accent/50 bg-accent/10 text-accent print:hidden'
                      : 'flex size-11 shrink-0 items-center justify-center rounded-sm border border-border-strong/60 bg-surface-raised text-ink-muted print:hidden'
                  }
                >
                  <Icon aria-hidden className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {item.organisation}
                    </h3>
                    <p className="label-mono tnum text-ink-muted">{item.timeframe}</p>
                  </div>
                  <p className="text-sm text-accent">{item.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.summary}</p>
                  <p className="label-mono tnum mt-3 text-ink-muted print:hidden">
                    {item.kind === 'build' ? 'Build' : 'Operate'} ·{' '}
                    {formatSpan(monthsBetween(item.start, item.end))}
                    {item.end === null ? ' and counting' : ''}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </Section>

      {featured.length > 0 ? (
        <Section aria-labelledby="work-heading" className="pb-0 print:hidden">
          <Heading
            id="work-heading"
            eyebrow="Selected work"
            title="Proof, not adjectives"
            action={
              <Link href="/work" className="label-mono text-accent underline-offset-4 hover:underline">
                All work →
              </Link>
            }
          />
          <ul className="grid gap-4 sm:grid-cols-3">
            {featured.map((project) => {
              const Art = project.coverImage
                ? undefined
                : LENS_ART[project.lenses.find((lens) => LENS_ART[lens]) ?? 'software']
              return (
                <li key={project.slug}>
                  <Link
                    href={`/work/${project.slug}`}
                    className="panel group flex h-full flex-col overflow-hidden rounded-sm transition-colors hover:border-border-strong"
                  >
                    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-border bg-surface-raised">
                      {project.coverImage ? (
                        <Image
                          src={project.coverImage.src}
                          alt={project.coverImage.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : Art ? (
                        <Art className="max-h-full px-10 py-4" />
                      ) : null}
                    </div>
                    <div className="flex flex-1 items-start justify-between gap-3 p-4">
                      <div>
                        <p className="label-mono text-accent">{project.proofVerb}</p>
                        <h3 className="mt-1.5 text-sm font-semibold text-ink">{project.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                          {project.oneLiner}
                        </p>
                      </div>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 text-ink-muted transition-colors group-hover:text-accent"
                      />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Section>
      ) : null}

      <Section aria-labelledby="recognition-heading" className="pb-0">
        <Heading id="recognition-heading" eyebrow="Recognition" title="Placed in competition" />
        <ol className="grid gap-4 sm:grid-cols-3 print:grid-cols-1 print:gap-1">
          {placements.map((item) => (
            <li key={item.slug} className="panel flex flex-col rounded-sm print:border-0">
              {item.image ? (
                <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-surface-raised print:hidden">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-contain p-3"
                  />
                  <span className="tnum absolute left-3 top-3 flex size-10 items-center justify-center rounded-full bg-accent font-display text-lg font-semibold text-accent-contrast shadow">
                    {item.placement!.split(' ')[0]}
                  </span>
                </div>
              ) : null}
              <div className="p-5 print:p-0">
                <p className="font-display text-xl font-semibold text-accent print:inline print:text-sm print:text-ink">
                  {item.placement}
                </p>
                <p className="mt-1.5 text-sm font-medium leading-snug text-ink print:mt-0 print:inline">
                  <span className="hidden print:inline"> — </span>
                  {item.title}
                </p>
                <p className="label-mono tnum mt-2 text-ink-muted print:mt-0">
                  {item.issuer} · {item.date.slice(0, 4)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section aria-labelledby="education-heading" className="pb-0">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Heading id="education-heading" eyebrow="Education" title="Studying" />
            <EducationCard />
          </div>

          <div>
            <Heading id="committees-heading" eyebrow="Also" title="Committees" />
            <CommitteeList />
          </div>
        </div>
      </Section>

      <Section aria-labelledby="capabilities-heading">
        <Heading id="capabilities-heading" eyebrow="Capabilities" title="What I work with" />
        <CapabilityGroups />

        <p className="label-mono mt-10 text-ink-muted">Last updated {resumeLastUpdated}</p>
      </Section>
    </div>
  )
}

function Hero({ stats }: { stats: { value: string; label: string }[] }) {
  const contacts = [
    { icon: MapPin, label: siteConfig.location },
    {
      icon: Mail,
      label: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
    {
      icon: Github,
      label: siteConfig.contact.github.replace('https://', ''),
      href: siteConfig.contact.github,
    },
    { icon: Linkedin, label: 'LinkedIn', href: siteConfig.contact.linkedin },
  ]

  return (
    <div className="relative overflow-hidden border-b border-border print:border-0">
      <GridBackdrop className="print:hidden" />
      <Section className="relative pb-12 pt-10 sm:pt-14 print:py-0">
        <div className="grid items-center gap-8 md:grid-cols-[14rem_1fr] lg:grid-cols-[17rem_1fr] lg:gap-12 print:block">
          <div className="relative mx-auto w-44 md:w-full print:hidden">
            <div className="panel relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="/images/profile/portrait.jpg"
                alt={siteConfig.legalName}
                fill
                priority
                sizes="(max-width: 768px) 11rem, 17rem"
                className="object-cover object-[48%_30%]"
              />
            </div>
            <span className="label-mono absolute -bottom-3 left-3 whitespace-nowrap rounded-sm bg-accent px-2 py-1 text-accent-contrast">
              ● Open to projects
            </span>
          </div>

          <div>
            <p className="label-mono text-accent print:hidden">Résumé</p>
            {/* The one place the full legal name is appropriate (PRD FR-08). */}
            <h1 className="mt-3 font-display text-headline font-semibold text-ink sm:text-display print:mt-0 print:text-3xl">
              {siteConfig.legalName}
            </h1>
            <p className="mt-2 text-lg text-ink-muted print:text-sm">{siteConfig.descriptor}</p>

            <ul className="mt-5 flex flex-wrap gap-2 print:mt-2 print:gap-x-4">
              {contacts.map(({ icon: Icon, label, href }) => {
                const inner = (
                  <>
                    <Icon aria-hidden className="size-3.5 text-accent print:hidden" />
                    {label}
                  </>
                )
                const chip =
                  'inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-ink-muted print:border-0 print:bg-transparent print:p-0'
                return (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        {...(href.startsWith('http')
                          ? { target: '_blank', rel: 'noreferrer noopener' }
                          : {})}
                        className={`${chip} transition-colors hover:border-border-strong hover:text-ink`}
                      >
                        {inner}
                      </a>
                    ) : (
                      <span className={chip}>{inner}</span>
                    )}
                  </li>
                )
              })}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3 print:hidden">
              {/*
                No PDF exists in the repository yet. Rather than link to a
                404, the page is print-styled, and the download control
                appears automatically once resumePdf is set in
                content/profile.ts. See CONTENT_TODO.md.
              */}
              {resumePdf ? (
                <a
                  href={resumePdf.href}
                  className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast"
                >
                  <Download aria-hidden className="size-4" />
                  Download PDF
                </a>
              ) : null}
              <PrintButton />
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4 print:hidden">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end bg-surface p-4 sm:p-5">
              <dt className="label-mono mt-1 text-ink-muted">{stat.label}</dt>
              <dd className="tnum font-display text-3xl font-semibold text-accent sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
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
