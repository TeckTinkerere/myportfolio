import { EVENT_ROLE_LABELS, EVENT_ROLE_VERBS, events } from '@/content/events'
import { getEventsByRole, getFeaturedEvent, getPublicEvents } from '@/lib/content/queries'
import { eventRoleSchema, portfolioEventSchema } from '@/lib/content/schema'

/**
 * Covers the event model added when Mohamed's real event log (12 records,
 * January-July 2026) replaced the single placeholder entry. Multi-role
 * events introduced `secondaryRoles`, which needed its own guarantees: it
 * must credit every role an event evidences without letting the ladder or
 * filters silently under- or double-count.
 */

describe('event roles', () => {
  it('has a label and a proof verb for every role the schema allows', () => {
    for (const role of eventRoleSchema.options) {
      expect(EVENT_ROLE_LABELS[role]).toBeTruthy()
      expect(EVENT_ROLE_VERBS[role]).toMatch(/^[A-Z]+$/)
    }
  })

  it('schema rejects a role repeated in its own secondaryRoles', () => {
    const base = {
      slug: 'example',
      name: 'Example',
      organiser: 'Example Org',
      date: '2026-01-01',
      role: 'host-emcee',
      roleLabel: 'Host / Emcee',
      summary: 'Summary.',
      responsibilities: ['Did the thing.'],
      visibility: 'public',
      permissionStatus: 'not-required',
    }

    expect(
      portfolioEventSchema.safeParse({ ...base, secondaryRoles: ['host-emcee'] }).success,
    ).toBe(false)

    expect(
      portfolioEventSchema.safeParse({ ...base, secondaryRoles: ['co-host-organiser'] })
        .success,
    ).toBe(true)
  })
})

describe('role attribution across the published record', () => {
  // The real content: every role now has at least one published record —
  // guards against a future edit silently emptying one out again.
  it('evidences all five roles, primary or secondary', () => {
    for (const role of eventRoleSchema.options) {
      expect(getEventsByRole(role).length).toBeGreaterThan(0)
    }
  })

  it('credits a multi-role event under each role it filters by', () => {
    const multiHat = getPublicEvents().find(
      (event) => (event.secondaryRoles?.length ?? 0) > 0,
    )!
    expect(multiHat).toBeDefined()

    expect(getEventsByRole(multiHat.role)).toContainEqual(
      expect.objectContaining({ slug: multiHat.slug }),
    )
    for (const secondary of multiHat.secondaryRoles!) {
      expect(getEventsByRole(secondary)).toContainEqual(
        expect.objectContaining({ slug: multiHat.slug }),
      )
    }
  })

  it('never lets a role appear as both primary and secondary on the same event', () => {
    for (const event of events) {
      if (event.secondaryRoles) expect(event.secondaryRoles).not.toContain(event.role)
    }
  })
})

describe('getFeaturedEvent', () => {
  it('prefers the explicitly ranked event over the merely most recent one', () => {
    const featured = getFeaturedEvent()
    const mostRecent = getPublicEvents()[0]

    expect(featured?.featuredRank).toBe(1)
    // The most recent published event by date is a different, unranked
    // record — proving the selection is rank-driven, not date-driven.
    expect(featured?.slug).not.toBe(mostRecent.slug)
  })
})

describe('roleLabel completeness', () => {
  it('states every role a multi-hat event performed, not only the primary', () => {
    for (const event of getPublicEvents()) {
      if (!event.secondaryRoles || event.secondaryRoles.length === 0) continue
      for (const role of [event.role, ...event.secondaryRoles]) {
        const fragment = EVENT_ROLE_LABELS[role].split(' / ')[0]
        expect(event.roleLabel).toContain(fragment)
      }
    }
  })
})
