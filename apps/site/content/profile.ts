import { readJson } from '@/lib/content/data-files'

/**
 * Personal narrative, principles, timeline and résumé source data.
 *
 * Stored in content/data/profile.json and edited through Keystatic
 * (/keystatic → Profile & résumé). This module only gives it types.
 *
 * Written as points rather than prose. Each page keeps one human sentence at
 * the top — a fully bulleted biography reads like a spec sheet.
 *
 * Experience entries carry real `start`/`end` dates, not just display
 * strings, because the /about timeline positions bars from them. `end: null`
 * means ongoing (an empty field in the editor).
 */

export type ExperienceEntry = {
  role: string
  organisation: string
  timeframe: string
  /** YYYY-MM. Drives the timeline. */
  start: string
  /** null means ongoing. */
  end: string | null
  summary: string
  kind: 'build' | 'operate'
  /** Impact bullets for the résumé. Empty for roles summarised in one line. */
  highlights: string[]
}

export type FeaturedProject = {
  name: string
  kind: string
  description: string
  stack: string[]
  role: string
  challenge: string
  built: string[]
  decision: string
  outcome: string
  /** Absolute URLs open externally; paths starting with / stay on this site. */
  links: { label: string; href: string }[]
}

export type SkillGroup = {
  group: string
  strong: string[]
  practical: string[]
  exposure: string[]
}

type ProfileFile = {
  headline: string
  summary: string
  experienceNote: string
  otherExperience: string[]
  featuredProjects: FeaturedProject[]
  technicalSkills: SkillGroup[]
  communication: string[]
  evidence: { label: string; text: string; href: string }[]
  bioOpener: string
  bioPoints: string[]
  principles: { title: string; body: string }[]
  education: {
    qualification: string
    institution: string
    timeframe: string
    start: string
    end: string
    coursework: string[]
  }
  experience: (Omit<ExperienceEntry, 'end'> & { end: string })[]
  leadership: { role: string; organisation: string; timeframe: string }[]
  capabilities: { group: string; items: string[] }[]
  resumePdf: { discriminant: boolean; value: { href: string; updated: string } | null }
  resumeLastUpdated: string
}

const data = readJson('profile.json') as ProfileFile

export const principles: readonly { title: string; body: string }[] = data.principles

/** One human opener, then the facts. */
export const bioOpener = data.bioOpener

export const bioPoints: readonly string[] = data.bioPoints

export const education = { ...data.education, end: data.education.end || null }

/** Reverse chronological. Only roles with a recorded timeframe appear. */
export const experience: ExperienceEntry[] = data.experience.map((entry) => ({
  ...entry,
  end: entry.end || null,
}))

export const leadership: readonly { role: string; organisation: string; timeframe: string }[] =
  data.leadership

/**
 * Capability groupings. Deliberately unranked — no percentages, no
 * self-awarded mastery levels. Evidence lives in the projects that used them.
 */
export const capabilities: readonly { group: string; items: readonly string[] }[] =
  data.capabilities

/**
 * Résumé PDF. While unset, /resume renders a print-styled page and the
 * download control stays hidden rather than pointing at a 404.
 */
export const resumePdf: { href: string; updated: string } | null =
  data.resumePdf.discriminant ? data.resumePdf.value : null

export const resumeLastUpdated = data.resumeLastUpdated

/** Résumé-only content. Engineering positioning, written for recruiters. */
export const resumeHeadline = data.headline
export const resumeSummary = data.summary
export const experienceNote = data.experienceNote
export const otherExperience: readonly string[] = data.otherExperience
export const featuredProjects: readonly FeaturedProject[] = data.featuredProjects
export const technicalSkills: readonly SkillGroup[] = data.technicalSkills
export const communicationEvidence: readonly string[] = data.communication
export const resumeEvidence: readonly { label: string; text: string; href: string }[] = data.evidence
