import { ArrowUpRight, Layers, Puzzle, Workflow } from 'lucide-react'
import { CodeIllustration, MicIllustration } from '@mohdaslam/ui/illustrations'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { CtaLink } from '@/components/layout/cta-link'
import { Section, SectionHeader } from '@/components/layout/section'
import { buildCareerLanes } from '@/components/profile/career-lanes'
import { CareerTrack } from '@/components/profile/career-track'
import {
  CapabilityGroups,
  CommitteeList,
  EducationCard,
  PrincipleIcon,
} from '@/components/profile/profile-blocks'
import { GridBackdrop, Panel } from '@/components/system/panel'
import { bioOpener, bioPoints, experience, principles } from '@/content/profile'
import { siteConfig } from '@/content/site-config'
import { getPublicEvents, getPublicProjects, getRecognition } from '@/lib/content/queries'
import type { PortfolioImage } from '@/lib/content/schema'

export const metadata: Metadata = {
  title: 'About',
  description: `${siteConfig.name} is a Singapore-based technology builder working across software, automation, web products, community initiatives and technology events.`,
  alternates: { canonical: '/about' },
}

/** One glyph per bio point, in the order profile.ts lists them. */
const BIO_ICONS = [Layers, Puzzle, Workflow] as const
const BIO_TITLES = ['One skill, many rooms', 'Starts as a vague problem', 'Decisions and follow-through']

export default function AboutPage() {
  const recognition = getRecognition()
  const placements = recognition
    .filter((item) => item.placement)
    .sort((a, b) => parseInt(a.placement!, 10) - parseInt(b.placement!, 10))
  const certifications = recognition.filter((item) => !item.placement)

  const projects = getPublicProjects()
  const events = getPublicEvents()
  const hosted = events.filter(
    (event) => event.role === 'host-emcee' || event.secondaryRoles?.includes('host-emcee'),
  ).length

  return (
    <>
      <Hero />

      <Section aria-label="In short" className="pb-0">
        <ul className="grid gap-4 md:grid-cols-3">
          {bioPoints.map((point, index) => {
            const Icon = BIO_ICONS[index] ?? Layers
            return (
              <li key={point} className="panel rounded-sm p-5">
                <span className="flex size-11 items-center justify-center rounded-sm border border-accent/40 bg-accent/10 text-accent">
                  <Icon aria-hidden className="size-5" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-ink">{BIO_TITLES[index]}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{point}</p>
              </li>
            )
          })}
        </ul>
      </Section>

      {/*
        The two halves of the work, each counted from the published record
        and each a door into the part of the site that proves it.
      */}
      <Section aria-label="Two sides of the work" className="pb-0">
        <SectionHeader eyebrow="Two sides" title="I build things, and I run rooms" />
        <div className="grid gap-4 md:grid-cols-2">
          <SideCard
            href="/work"
            art={<CodeIllustration />}
            eyebrow="Builder"
            count={projects.length}
            unit="published projects"
            body="Products, platforms and automation — from first sketch to something people use."
            linkLabel="See the work"
          />
          <SideCard
            href="/events"
            art={<MicIllustration />}
            eyebrow="Operator & host"
            count={events.length}
            unit={`events · ${hosted} hosted`}
            body="Hackathons, workshops and meetups — hosting, teaching and keeping the day running."
            linkLabel="See the events"
          />
        </div>
      </Section>

      <Section aria-label="Timeline" className="pb-0">
        <SectionHeader eyebrow="Timeline" title="What I have been doing" />
        <CareerTrack
          lanes={buildCareerLanes()}
          caption="Positioned from real dates. Diamonds are events; filled ones I hosted."
        />
        <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {experience.map((item) => (
            <div key={`${item.organisation}-${item.role}`} className="border-l-2 border-accent/40 pl-4">
              <dt className="text-sm font-semibold text-ink">
                {item.organisation}
                <span className="font-normal text-ink-muted"> · {item.role}</span>
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{item.summary}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section aria-label="Principles" className="pb-0">
        <SectionHeader eyebrow="How I work" title="Three things I hold to" />
        {/* Numbered because it genuinely is a sequence. */}
        <ol className="grid gap-4 sm:grid-cols-3">
          {principles.map((principle, index) => (
            <li key={principle.title}>
              <Panel className="h-full" designation={`Step ${index + 1}`}>
                <div className="p-5">
                  <PrincipleIcon index={index} />
                  <h3 className="text-base font-semibold text-ink">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{principle.body}</p>
                </div>
              </Panel>
            </li>
          ))}
        </ol>
      </Section>

      <Section aria-label="Education and committees" className="pb-0">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeader eyebrow="Education" title="Studying" />
            <EducationCard />
          </div>
          <div>
            <SectionHeader eyebrow="Also" title="Committees" />
            <CommitteeList />
          </div>
        </div>
      </Section>

      <Section aria-label="Capabilities" className="pb-0">
        <SectionHeader
          eyebrow="Capabilities"
          title="What I work with"
          description="Listed, not ranked. Where each was used is visible in the work."
        />
        <CapabilityGroups />
      </Section>

      <Section aria-label="Recognition" id="recognition" className="pb-0">
        <SectionHeader eyebrow="Recognition" title="Awards and certifications" />

        <ol className="grid gap-4 sm:grid-cols-3">
          {placements.map((item) => (
            <li key={item.slug} className="panel flex flex-col rounded-sm">
              <div className="relative">
                <CertificateImage image={item.image} />
                <span className="absolute left-3 top-3 flex size-10 items-center justify-center rounded-full bg-accent font-display text-lg font-semibold text-accent-contrast shadow">
                  {item.placement!.split(' ')[0]}
                </span>
              </div>
              <div className="p-5">
                <p className="font-display text-xl font-semibold text-accent">{item.placement}</p>
                <p className="mt-1.5 text-sm font-medium leading-snug text-ink">{item.title}</p>
                <p className="label-mono tnum mt-2 text-ink-muted">
                  {item.issuer} · {item.date.slice(0, 4)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Course completions, kept visually subordinate to the placements so
            an attendance certificate never reads as an award: smaller, no
            placement line, and after the awards. */}
        <h3 className="label-mono mt-10 text-ink-muted">Certifications</h3>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {certifications.map((item) => (
            <li
              key={item.slug}
              className="flex flex-col overflow-hidden rounded-sm border border-border bg-surface"
            >
              <CertificateImage image={item.image} />
              <div className="p-3">
                <p className="text-xs font-medium leading-snug text-ink">{item.title}</p>
                <p className="tnum mt-1 text-[0.7rem] text-ink-muted">
                  {item.issuer} · {item.date.slice(0, 4)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <Panel designation="Next step" className="overflow-hidden">
          <div className="grid sm:grid-cols-[1fr_16rem]">
            <div className="p-8 sm:p-10">
              <h2 className="font-display text-headline font-semibold text-ink">
                Want to talk about something specific?
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <CtaLink href="/contact">Get in touch</CtaLink>
                <CtaLink href="/resume" variant="secondary">
                  Read the résumé
                </CtaLink>
              </div>
            </div>
            <div className="relative min-h-[14rem] border-t border-border sm:border-l sm:border-t-0">
              <Image
                src="/images/profile/portrait.jpg"
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 16rem"
                className="object-cover object-[48%_30%]"
              />
            </div>
          </div>
        </Panel>
      </Section>
    </>
  )
}

function Hero() {
  return (
    <div className="relative overflow-hidden border-b border-border">
      <GridBackdrop />
      <Section className="relative pb-14 pt-10 sm:pt-14">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div className="hero-seq">
            <p className="label-mono text-accent">About · {siteConfig.location}</p>
            <h1 className="mt-4 font-display text-display font-semibold text-ink">
              {siteConfig.descriptor}
            </h1>
            {/* One human sentence; the points follow below as cards. */}
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-ink">{bioOpener}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink href="/contact">Get in touch</CtaLink>
              <CtaLink href="/resume" variant="secondary">
                Résumé
              </CtaLink>
            </div>
          </div>

          {/*
            Two photographs, two sides: the portrait, and the one cleared
            event photo pinned over its corner. Both images are already
            public elsewhere on the site.
          */}
          <div className="relative mx-auto w-full max-w-md pb-16 pr-10 sm:pr-16">
            <div className="panel relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="/images/profile/portrait.jpg"
                alt={siteConfig.name}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 26rem"
                className="object-cover object-[48%_30%]"
              />
            </div>
            <figure className="absolute bottom-0 right-0 w-[48%] rotate-2">
              <div className="panel relative aspect-[3/4] overflow-hidden rounded-sm shadow-2xl">
                <Image
                  src="/images/events/facilitating.jpg"
                  alt={`${siteConfig.name} speaking at a technology workshop`}
                  fill
                  sizes="12rem"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="label-mono absolute -bottom-3 left-3 whitespace-nowrap rounded-sm bg-accent px-2 py-1 text-accent-contrast">
                ● On the mic
              </figcaption>
            </figure>
          </div>
        </div>
      </Section>
    </div>
  )
}

function SideCard({
  href,
  art,
  eyebrow,
  count,
  unit,
  body,
  linkLabel,
}: {
  href: string
  art: React.ReactNode
  eyebrow: string
  count: number
  unit: string
  body: string
  linkLabel: string
}) {
  return (
    <Link
      href={href}
      className="panel group grid overflow-hidden rounded-sm transition-colors hover:border-border-strong sm:grid-cols-[1fr_1.1fr]"
    >
      <div className="flex items-center justify-center border-b border-border bg-surface-raised px-10 py-6 sm:border-b-0 sm:border-r">
        <div className="w-full transition-transform duration-500 group-hover:scale-[1.05]">{art}</div>
      </div>
      <div className="flex flex-col p-6">
        <p className="label-mono text-accent">{eyebrow}</p>
        <p className="mt-3 flex items-baseline gap-2">
          <span className="tnum font-display text-4xl font-semibold text-ink">{count}</span>
          <span className="text-sm text-ink-muted">{unit}</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
        <span className="label-mono mt-auto flex items-center gap-1.5 pt-5 text-accent">
          {linkLabel}
          <ArrowUpRight aria-hidden className="size-3.5" />
        </span>
      </div>
    </Link>
  )
}

function CertificateImage({ image }: { image?: PortfolioImage }) {
  if (!image) return null
  return (
    <div className="relative aspect-[4/3] overflow-hidden border-b border-border bg-surface-raised">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 50vw, 20vw"
        className="object-contain p-2"
      />
    </div>
  )
}
