import type { Metadata } from 'next'
import Image from 'next/image'

import { CtaLink } from '@/components/layout/cta-link'
import { Section, SectionHeader } from '@/components/layout/section'
import { Panel } from '@/components/system/panel'
import { Timeline } from '@/components/system/diagram'
import {
  bioOpener,
  bioPoints,
  capabilities,
  education,
  experience,
  leadership,
  principles,
} from '@/content/profile'
import { siteConfig } from '@/content/site-config'
import { getRecognition } from '@/lib/content/queries'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.name} is a Singapore-based technology builder working across software, automation, web products, community initiatives and technology events.`,
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  const recognition = getRecognition()
  const placements = recognition.filter((item) => item.placement)
  const certifications = recognition.filter((item) => !item.placement)

  return (
    <>
      <Section className="pb-0">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div>
            <h1 className="font-display text-headline font-semibold text-ink">
              {siteConfig.descriptor}
            </h1>

            {/* One human sentence, then points. */}
            <p className="prose-measure mt-6 text-lg leading-relaxed text-ink">
              {bioOpener}
            </p>

            <ul className="prose-measure mt-6 flex flex-col gap-3">
              {bioPoints.map((point) => (
                <li key={point} className="flex gap-3 text-base leading-relaxed text-ink-muted">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border bg-surface-raised lg:sticky lg:top-24">
            <Image
              src="/images/profile/portrait.jpg"
              alt={siteConfig.name}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Section>

      {/*
        Replaces the stacked date/role prose blocks. Durations are positioned
        from real start/end dates in content/profile.ts, on one shared axis.
      */}
      <Section aria-labelledby="timeline-heading">
        <SectionHeader
          as="h2"
          eyebrow="Timeline"
          title="What I have been doing"
        />
        <div id="timeline-heading" className="sr-only">
          Timeline
        </div>
        <Timeline
          caption="Roles by duration. Study runs underneath all of it."
          tracks={[
            {
              label: education.qualification,
              sublabel: education.institution,
              start: education.start,
              end: education.end,
              ongoing: true,
            },
            ...experience.map((item) => ({
              label: item.role,
              sublabel: item.organisation,
              start: item.start,
              end: item.end,
              ongoing: item.end === null,
              accent: item.kind === 'build',
            })),
          ]}
        />

        <dl className="mt-2 grid gap-4 sm:grid-cols-2">
          {experience.map((item) => (
            <div key={`${item.organisation}-${item.role}`} className="border-t border-border pt-3">
              <dt className="text-sm font-semibold text-ink">
                {item.role}
                <span className="font-normal text-accent"> · {item.organisation}</span>
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{item.summary}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section aria-labelledby="principles-heading" className="pt-0">
        <SectionHeader eyebrow="How I work" title="Three things I hold to" />
        <ol className="grid gap-4 sm:grid-cols-3">
          {principles.map((principle, index) => (
            <li key={principle.title}>
              <Panel className="h-full" designation={`Step ${index + 1}`}>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-ink">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {principle.body}
                  </p>
                </div>
              </Panel>
            </li>
          ))}
        </ol>
      </Section>

      <Section aria-labelledby="education-heading" className="pt-0">
        <SectionHeader eyebrow="Education" title={education.qualification} />
        <Panel designation={education.institution} meta={education.timeframe}>
          <div className="p-5">
            <h3 className="label-mono text-ink-muted">Relevant coursework</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {education.coursework.map((course) => (
                <li
                  key={course}
                  className="rounded-full border border-border px-3 py-1 text-xs text-ink-muted"
                >
                  {course}
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </Section>

      <Section aria-labelledby="leadership-heading" className="pt-0">
        <SectionHeader eyebrow="Also" title="Committees and community roles" />
        <ul className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
          {leadership.map((role) => (
            <li key={role.organisation} className="bg-surface p-5">
              <p className="text-sm font-semibold text-ink">{role.role}</p>
              <p className="mt-1.5 text-sm text-ink-muted">{role.organisation}</p>
              <p className="label-mono tnum mt-3 text-ink-muted">{role.timeframe}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="capabilities-heading" className="pt-0">
        <SectionHeader
          eyebrow="Capabilities"
          title="What I work with"
          description="Listed, not ranked. Where each was used is visible in the work."
        />
        <dl className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
          {capabilities.map((group) => (
            <div key={group.group} className="bg-surface p-5">
              <dt className="label-mono text-accent">{group.group}</dt>
              <dd className="mt-3 text-sm leading-relaxed text-ink-muted">
                {group.items.join(' · ')}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section aria-labelledby="recognition-heading" id="recognition" className="pt-0">
        <SectionHeader
          eyebrow="Recognition"
          title="Awards and certifications"
          description="Issued by third parties, on the dates shown."
        />

        <ul className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
          {placements.map((item) => (
            <li key={item.slug} className="bg-surface p-5">
              <p className="font-display text-2xl font-semibold text-accent">
                {item.placement}
              </p>
              <p className="mt-2 text-sm font-medium leading-snug text-ink">{item.title}</p>
              <p className="label-mono tnum mt-2 text-ink-muted">
                {item.issuer} · {item.date}
              </p>
            </li>
          ))}
        </ul>

        {/* Course completions, kept visually subordinate to the placements so
            an attendance certificate never reads as an award. */}
        <h3 className="label-mono mt-8 text-ink-muted">Certifications</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {certifications.map((item) => (
            <li key={item.slug} className="flex flex-wrap gap-x-3 text-sm text-ink-muted">
              <span className="text-ink">{item.title}</span>
              <span className="tnum">
                {item.issuer} · {item.date}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0">
        <Panel designation="Next step">
          <div className="p-8">
            <h2 className="font-display text-title font-semibold text-ink">
              Want to talk about something specific?
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaLink href="/contact">Get in touch</CtaLink>
              <CtaLink href="/resume" variant="secondary">
                Read the résumé
              </CtaLink>
            </div>
          </div>
        </Panel>
      </Section>
    </>
  )
}
