import type { TrackLane } from '@/components/profile/career-track'
import { education, experience } from '@/content/profile'
import { getPublicEvents } from '@/lib/content/queries'

/**
 * The lanes behind every CareerTrack on the site — study, build, operate and
 * events — assembled in one place so /about and /resume draw the same
 * picture from the same record.
 */
export function buildCareerLanes(): TrackLane[] {
  return [
    {
      name: 'Study',
      kind: 'bars',
      tone: 'study',
      bars: [
        {
          label: 'Diploma in IT',
          sublabel: education.institution,
          start: education.start,
          end: education.end,
        },
      ],
    },
    {
      name: 'Build',
      kind: 'bars',
      tone: 'accent',
      bars: experience
        .filter((item) => item.kind === 'build')
        .map((item) => ({
          label: item.organisation,
          sublabel: item.role.split(',')[0]!,
          start: item.start,
          end: item.end,
        })),
    },
    {
      name: 'Operate',
      kind: 'bars',
      tone: 'neutral',
      bars: experience
        .filter((item) => item.kind === 'operate')
        .map((item) => ({
          label: item.organisation,
          sublabel: item.role,
          start: item.start,
          end: item.end,
        })),
    },
    {
      name: 'Events',
      kind: 'points',
      points: getPublicEvents().map((event) => ({
        label: event.name,
        date: event.date,
        highlight: event.role === 'host-emcee',
      })),
    },
  ]
}
