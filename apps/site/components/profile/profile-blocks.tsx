import {
  Code2,
  Crosshair,
  Database,
  GraduationCap,
  MessagesSquare,
  Package,
  RefreshCw,
  Users,
  Wrench,
} from 'lucide-react'

import { capabilities, education, leadership } from '@/content/profile'

/**
 * Profile blocks shared by /about and /resume, so the two pages cannot drift
 * into describing the same study, committees or skills two different ways.
 * Each carries its own print styling, since /resume is printed.
 */

export function EducationCard() {
  return (
    <div className="panel rounded-sm p-5 print:border-0 print:p-0">
      <div className="flex gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-border-strong/60 bg-surface-raised text-accent print:hidden">
          <GraduationCap aria-hidden className="size-5" />
        </span>
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            {education.qualification}
          </h3>
          <p className="text-sm text-accent">
            {education.institution} · {education.timeframe}
          </p>
        </div>
      </div>
      <ul className="mt-5 flex flex-wrap gap-2">
        {education.coursework.map((course) => (
          <li
            key={course}
            className="rounded-full border border-border px-3 py-1 text-xs text-ink-muted print:border-0 print:px-0 print:after:ml-2 print:after:content-['·'] last:print:after:content-none"
          >
            {course}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CommitteeList() {
  return (
    <ul className="flex flex-col gap-3">
      {leadership.map((role) => (
        <li
          key={role.organisation}
          className="panel flex items-center gap-4 rounded-sm p-4 print:border-0 print:p-0"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-raised text-accent print:hidden">
            <Users aria-hidden className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{role.role}</p>
            <p className="text-xs text-ink-muted">{role.organisation}</p>
          </div>
          <p className="label-mono tnum shrink-0 text-ink-muted">{role.timeframe}</p>
        </li>
      ))}
    </ul>
  )
}

const CAPABILITY_ICONS = [Code2, Database, Wrench, MessagesSquare] as const

/** Unranked on purpose: no bars, no percentages, no self-scored mastery. */
export function CapabilityGroups() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-1 print:gap-2">
      {capabilities.map((group, index) => {
        const Icon = CAPABILITY_ICONS[index] ?? Code2
        return (
          <div key={group.group} className="panel rounded-sm p-5 print:border-0 print:p-0">
            <h3 className="label-mono flex items-center gap-2 text-accent">
              <Icon aria-hidden className="size-4 print:hidden" />
              {group.group}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2 print:mt-1">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-sm border border-border bg-surface-raised px-2.5 py-1 text-xs text-ink print:border-0 print:bg-transparent print:px-0 print:after:ml-2 print:after:content-['·'] last:print:after:content-none"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

/** One glyph per working principle: pin the problem down, ship small, iterate. */
const PRINCIPLE_ICONS = [Crosshair, Package, RefreshCw] as const

export function PrincipleIcon({ index }: { index: number }) {
  const Icon = PRINCIPLE_ICONS[index] ?? Crosshair
  return (
    <span className="mb-4 flex size-11 items-center justify-center rounded-sm border border-accent/40 bg-accent/10 text-accent">
      <Icon aria-hidden className="size-5" />
    </span>
  )
}
