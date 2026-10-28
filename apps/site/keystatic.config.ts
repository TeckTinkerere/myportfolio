import { collection, config, fields, singleton } from '@keystatic/core'

/**
 * Keystatic CMS — edits the JSON files under content/data/ through /keystatic.
 *
 * Locally it writes straight to disk. In production it commits to GitHub
 * (set NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO plus the KEYSTATIC_* secrets), and
 * Vercel redeploys on the commit. No database involved.
 *
 * These fields mirror lib/content/schema.ts. The Zod schema stays the source
 * of truth: anything Keystatic lets through that breaks a rule still fails
 * the build, with the slug and field named.
 */

const githubRepo = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO as
  | `${string}/${string}`
  | undefined

/**
 * Whether the editor and its API may be served at all.
 *
 * Local storage mode has no authentication: its API reads and writes content
 * files for anyone who can reach it. So local mode is development-only, and
 * production serves the editor only when GitHub storage (which requires a
 * GitHub login with repo access) is configured. Anything else fails closed.
 */
export const keystaticEnabled = process.env.NODE_ENV === 'development' || Boolean(githubRepo)

const permissionStatus = fields.select({
  label: 'Permission status',
  options: [
    { label: 'Not required', value: 'not-required' },
    { label: 'Approved', value: 'approved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Prohibited', value: 'prohibited' },
  ],
  defaultValue: 'not-required',
})

const visibility = fields.select({
  label: 'Visibility',
  options: [
    { label: 'Public', value: 'public' },
    { label: 'Sanitised', value: 'sanitised' },
    { label: 'Gated', value: 'gated' },
    { label: 'Private', value: 'private' },
  ],
  defaultValue: 'public',
})

const stringList = (label: string) =>
  fields.array(fields.text({ label }), { label, itemLabel: (p) => p.value })

const image = fields.object({
  src: fields.text({ label: 'Image path (e.g. /projects/foo.png)' }),
  alt: fields.text({ label: 'Alt text' }),
  caption: fields.text({ label: 'Caption' }),
  permissionStatus,
})

const optionalUrl = (label: string) => fields.text({ label, description: 'Leave empty if none' })

const rank = (label: string) => fields.integer({ label })

export default config({
  storage: githubRepo ? { kind: 'github', repo: githubRepo } : { kind: 'local' },
  ui: { brand: { name: 'Portfolio content' } },

  collections: {
    projects: collection({
      label: 'Projects',
      path: 'content/data/projects/*',
      format: { data: 'json' },
      slugField: 'title',
      columns: ['title', 'status'],
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
          slug: { label: 'Slug', description: 'URL: /work/<slug>' },
        }),
        sortOrder: fields.integer({
          label: 'Display order',
          description: 'Tie-breaker when ranks are equal. Lower shows first.',
          defaultValue: 100,
        }),
        proofVerb: fields.text({ label: 'Proof verb', description: 'One uppercase word: BUILT, LAUNCHED…' }),
        oneLiner: fields.text({ label: 'One-liner', description: 'Max 160 characters' }),
        shortSummary: fields.text({ label: 'Short summary', multiline: true }),
        longSummary: fields.text({ label: 'Long summary (required for Tier 1)', multiline: true }),
        lenses: fields.multiselect({
          label: 'Lenses',
          options: [
            { label: 'General', value: 'general' },
            { label: 'Software', value: 'software' },
            { label: 'Websites', value: 'websites' },
            { label: 'Events', value: 'events' },
            { label: 'Community', value: 'community' },
          ],
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Pilot completed', value: 'pilot-completed' },
            { label: 'Prototype', value: 'prototype' },
            { label: 'In development', value: 'in-development' },
            { label: 'Archived', value: 'archived' },
            { label: 'Concept', value: 'concept' },
            { label: 'Confidential', value: 'confidential' },
          ],
          defaultValue: 'in-development',
        }),
        visibility,
        permissionStatus,
        tier: fields.select({
          label: 'Tier',
          description: 'Tier 1 gets a full case-study page',
          options: [
            { label: 'Tier 1 (case study)', value: '1' },
            { label: 'Tier 2 (archive card)', value: '2' },
          ],
          defaultValue: '2',
        }),
        role: fields.text({ label: 'Role' }),
        organisation: fields.text({ label: 'Organisation' }),
        startDate: fields.text({ label: 'Start date (YYYY-MM or YYYY-MM-DD)' }),
        endDate: fields.text({ label: 'End date (YYYY-MM or YYYY-MM-DD)' }),
        timeframeLabel: fields.text({ label: 'Timeframe label', description: 'e.g. September 2024 – present' }),
        teamSize: fields.integer({ label: 'Team size' }),
        location: fields.text({ label: 'Location' }),
        responsibilities: stringList('Responsibilities'),
        constraints: stringList('Constraints'),
        outcomes: stringList('Outcomes'),
        learnings: stringList('Learnings'),
        technologies: stringList('Technologies'),
        metrics: fields.array(
          fields.object({
            value: fields.text({ label: 'Value' }),
            label: fields.text({ label: 'Label' }),
            verified: fields.checkbox({ label: 'Verified' }),
            permissionStatus,
            publicSourceUrl: optionalUrl('Public source URL (required if verified)'),
          }),
          { label: 'Metrics', itemLabel: (p) => `${p.fields.value.value} ${p.fields.label.value}` },
        ),
        evidence: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            type: fields.select({
              label: 'Type',
              options: [
                { label: 'Live site', value: 'live-site' },
                { label: 'Demo', value: 'demo' },
                { label: 'Repository', value: 'repository' },
                { label: 'Event page', value: 'event-page' },
                { label: 'Media', value: 'media' },
                { label: 'Partner reference', value: 'partner-reference' },
                { label: 'Testimonial', value: 'testimonial' },
                { label: 'Document', value: 'document' },
              ],
              defaultValue: 'live-site',
            }),
            href: fields.url({ label: 'URL' }),
            public: fields.checkbox({ label: 'Public', defaultValue: true }),
          }),
          { label: 'Evidence links', itemLabel: (p) => p.fields.label.value },
        ),
        coverImage: fields.conditional(fields.checkbox({ label: 'Has cover image' }), {
          true: image,
          false: fields.empty(),
        }),
        gallery: fields.array(image, { label: 'Gallery', itemLabel: (p) => p.fields.alt.value }),
        featuredRank: fields.object(
          {
            general: rank('General'),
            software: rank('Software'),
            websites: rank('Websites'),
            events: rank('Events'),
            community: rank('Community'),
          },
          { label: 'Featured rank per lens', description: 'Leave empty to not feature in that lens' },
        ),
        seoTitle: fields.text({ label: 'SEO title' }),
        seoDescription: fields.text({ label: 'SEO description', multiline: true }),
        confidentialityNote: fields.text({ label: 'Confidentiality note (required if sanitised)', multiline: true }),
        lastVerifiedAt: fields.text({ label: 'Last verified (YYYY-MM-DD)' }),
      },
    }),

    events: collection({
      label: 'Events',
      path: 'content/data/events/*',
      format: { data: 'json' },
      slugField: 'name',
      columns: ['name', 'date'],
      schema: {
        name: fields.slug({ name: { label: 'Event name' }, slug: { label: 'Slug' } }),
        organiser: fields.text({ label: 'Organiser' }),
        date: fields.text({ label: 'Date (YYYY-MM-DD)' }),
        role: fields.select({
          label: 'Primary role',
          options: eventRoles(),
          defaultValue: 'facilitator-teaching-assistant',
        }),
        secondaryRoles: fields.multiselect({ label: 'Secondary roles', options: eventRoles() }),
        roleLabel: fields.text({ label: 'Role label (shown on page)' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        responsibilities: stringList('Responsibilities'),
        audienceType: fields.text({ label: 'Audience type' }),
        verifiedAudienceSize: fields.text({ label: 'Verified audience size' }),
        publicEventUrl: optionalUrl('Public event URL'),
        testimonial: fields.conditional(fields.checkbox({ label: 'Has testimonial' }), {
          true: fields.object({
            quote: fields.text({ label: 'Quote', multiline: true }),
            attribution: fields.text({ label: 'Attribution' }),
            permissionStatus,
          }),
          false: fields.empty(),
        }),
        images: fields.array(image, { label: 'Images', itemLabel: (p) => p.fields.alt.value }),
        visibility,
        permissionStatus,
        featuredRank: fields.integer({ label: 'Featured rank' }),
        hasDetailPage: fields.checkbox({ label: 'Has detail page' }),
      },
    }),
  },

  singletons: {
    profile: singleton({
      label: 'Profile & résumé',
      path: 'content/data/profile',
      format: { data: 'json' },
      schema: {
        headline: fields.text({ label: 'Résumé headline', description: 'One line under your name on /resume' }),
        summary: fields.text({ label: 'Résumé summary', multiline: true }),
        experienceNote: fields.text({ label: 'Experience footnote (confidentiality)', multiline: true }),
        otherExperience: stringList('Other experience (one line each)'),
        featuredProjects: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            kind: fields.text({ label: 'Kind', description: 'e.g. Open-source developer tooling' }),
            description: fields.text({ label: 'One-line description', multiline: true }),
            stack: stringList('Tech stack'),
            role: fields.text({ label: 'My role' }),
            challenge: fields.text({ label: 'Engineering challenge', multiline: true }),
            built: stringList('What I built'),
            decision: fields.text({ label: 'Key design decision', multiline: true }),
            outcome: fields.text({ label: 'Outcome / scale', multiline: true }),
            links: fields.array(
              fields.object({
                label: fields.text({ label: 'Label' }),
                href: fields.text({ label: 'URL or /path' }),
              }),
              { label: 'Links', itemLabel: (p) => p.fields.label.value },
            ),
          }),
          { label: 'Résumé: featured engineering projects', itemLabel: (p) => p.fields.name.value },
        ),
        technicalSkills: fields.array(
          fields.object({
            group: fields.text({ label: 'Group' }),
            strong: stringList('Strong working knowledge'),
            practical: stringList('Practical project experience'),
            exposure: stringList('Exposure'),
          }),
          { label: 'Résumé: technical skills', itemLabel: (p) => p.fields.group.value },
        ),
        communication: stringList('Résumé: technical communication evidence'),
        evidence: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            text: fields.text({ label: 'Text' }),
            href: fields.text({ label: 'Link (URL or #section)' }),
          }),
          { label: 'Résumé: evidence strip under the hero (max 3)', itemLabel: (p) => p.fields.label.value },
        ),
        bioOpener: fields.text({ label: 'Bio opener', multiline: true }),
        bioPoints: stringList('Bio points'),
        principles: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            body: fields.text({ label: 'Body', multiline: true }),
          }),
          { label: 'Principles', itemLabel: (p) => p.fields.title.value },
        ),
        education: fields.object(
          {
            qualification: fields.text({ label: 'Qualification' }),
            institution: fields.text({ label: 'Institution' }),
            timeframe: fields.text({ label: 'Timeframe label' }),
            start: fields.text({ label: 'Start (YYYY-MM)' }),
            end: fields.text({ label: 'End (YYYY-MM)', description: 'Empty means ongoing' }),
            coursework: stringList('Coursework'),
          },
          { label: 'Education' },
        ),
        experience: fields.array(
          fields.object({
            role: fields.text({ label: 'Role' }),
            organisation: fields.text({ label: 'Organisation' }),
            timeframe: fields.text({ label: 'Timeframe label' }),
            start: fields.text({ label: 'Start (YYYY-MM)' }),
            end: fields.text({ label: 'End (YYYY-MM)', description: 'Empty means ongoing' }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            kind: fields.select({
              label: 'Kind',
              options: [
                { label: 'Build', value: 'build' },
                { label: 'Operate', value: 'operate' },
              ],
              defaultValue: 'build',
            }),
            highlights: stringList('Résumé bullets (action + system + approach + result)'),
          }),
          {
            label: 'Experience (newest first)',
            itemLabel: (p) => `${p.fields.role.value} — ${p.fields.organisation.value}`,
          },
        ),
        leadership: fields.array(
          fields.object({
            role: fields.text({ label: 'Role' }),
            organisation: fields.text({ label: 'Organisation' }),
            timeframe: fields.text({ label: 'Timeframe' }),
          }),
          { label: 'Leadership', itemLabel: (p) => p.fields.role.value },
        ),
        capabilities: fields.array(
          fields.object({
            group: fields.text({ label: 'Group' }),
            items: stringList('Items'),
          }),
          { label: 'Capabilities', itemLabel: (p) => p.fields.group.value },
        ),
        resumePdf: fields.conditional(fields.checkbox({ label: 'Has résumé PDF' }), {
          true: fields.object({
            href: fields.text({ label: 'PDF path (e.g. /resume/cv.pdf)' }),
            updated: fields.text({ label: 'Updated (YYYY-MM)' }),
          }),
          false: fields.empty(),
        }),
        resumeLastUpdated: fields.text({ label: 'Résumé last updated (YYYY-MM)' }),
        academics: fields.object(
          {
            expectedGraduation: fields.text({
              label: 'Expected graduation',
              description: 'Display label, e.g. April 2027. Empty hides it.',
            }),
            gpa: fields.text({
              label: 'Cumulative GPA',
              description: 'Exactly as on the transcript. Empty hides it.',
            }),
            gpaScale: fields.text({ label: 'GPA scale', defaultValue: '4.0' }),
            gpaAsOf: fields.text({ label: 'GPA as of', description: 'e.g. after Year 3 Semester 1' }),
            semesterGpas: fields.array(
              fields.object({
                term: fields.text({ label: 'Term', description: 'e.g. Year 1, Sem 1' }),
                gpa: fields.text({ label: 'Semester GPA' }),
              }),
              {
                label: 'Semester GPAs (oldest first)',
                itemLabel: (p) => `${p.fields.term.value} — ${p.fields.gpa.value}`,
              },
            ),
            directorsList: stringList("Director's List (academic year, e.g. AY2024/25)"),
            certificates: stringList('Certificates awarded with the diploma'),
            notableModules: fields.array(
              fields.object({
                name: fields.text({ label: 'Module' }),
                grade: fields.text({ label: 'Grade' }),
                note: fields.text({ label: 'What it taught or led to (optional)' }),
              }),
              {
                label: 'Notable modules (rows without a grade are hidden)',
                itemLabel: (p) => `${p.fields.name.value} — ${p.fields.grade.value}`,
              },
            ),
            mathematics: fields.array(
              fields.object({
                name: fields.text({ label: 'Module' }),
                grade: fields.text({ label: 'Grade' }),
              }),
              {
                label: 'Mathematics modules (rows without a grade are hidden)',
                itemLabel: (p) => `${p.fields.name.value} — ${p.fields.grade.value}`,
              },
            ),
            plans: fields.text({
              label: 'Plans after the diploma',
              description: 'e.g. National Service, then university',
              multiline: true,
            }),
            whyComputing: stringList('Why computing (one paragraph each)'),
            thread: fields.array(
              fields.object({
                title: fields.text({ label: 'Title' }),
                body: fields.text({ label: 'Body', multiline: true }),
                href: fields.text({ label: 'Evidence link (/path or URL)' }),
              }),
              { label: 'The thread through my work', itemLabel: (p) => p.fields.title.value },
            ),
            interests: fields.array(
              fields.object({
                area: fields.text({ label: 'Area' }),
                why: fields.text({ label: 'Why', multiline: true }),
              }),
              { label: 'What I want to study', itemLabel: (p) => p.fields.area.value },
            ),
          },
          { label: 'Academics (/academics)' },
        ),
      },
    }),
  },
})

function eventRoles() {
  return [
    { label: 'Host / Emcee', value: 'host-emcee' },
    { label: 'Co-host / Organiser', value: 'co-host-organiser' },
    { label: 'Workshop Instructor', value: 'workshop-instructor' },
    { label: 'Facilitator / Teaching Assistant', value: 'facilitator-teaching-assistant' },
    { label: 'Event Operations Support', value: 'event-operations-support' },
  ] as const
}
