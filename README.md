# mohdaslam.dev

Personal site for Mohamed Aslam — technology builder and community operator,
Singapore.

Built as a proof-of-work platform rather than a decorative portfolio: one
typed content source feeds five audience lenses, and the build refuses to
publish anything whose facts or permissions have not been settled.

## Quick start

```bash
npm ci
cp .env.example .env.local   # optional — the site runs without it
npm run dev
```

Nothing in `.env.local` is required to run the site. Without the Brevo keys
the contact form still renders and validates; it just reports that delivery
is not connected yet rather than pretending to send.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `typecheck` first via `prebuild`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint via `next lint` |
| `npm test` | Jest — content rules, contact validation, link integrity |
| `npm run verify` | typecheck → lint → test → build |

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind CSS 3 · Zod ·
next-themes · a handful of Radix primitives · Jest.

Server components by default. Only three things ship client JavaScript: the
mobile navigation drawer, the theme toggle, and the contact form.

## How content works

All content lives in `content/` as typed TypeScript. There is no CMS.

```
content/
  site-config.ts       identity, nav, contact — the single source of truth
  profile.ts           bio, principles, timeline, education, résumé data
  projects/            one file per case study, plus archive.ts for compact entries
  events/index.ts      event records
  recognition.ts       third-party awards and certifications
lib/content/
  schema.ts            Zod schemas + inferred types
  queries.ts           server-only: the publication boundary
  public-view.ts       narrows a project before it crosses into a client component
```

### The build fails on bad content

`content/projects/index.ts` calls `parseProjects()` at module scope. Because
the route pages import it, a schema violation throws during static generation
and fails `next build`, naming the slug and the field. Unlike a type error,
this cannot be silenced by a config flag.

The build refuses to publish when:

- an item claims `visibility: 'public'` while its permission is `pending` or `prohibited`
- a published image has no alt text
- a published Tier 1 case study has no outcome or no long summary
- a metric is marked `verified` without a `publicSourceUrl`
- a sanitised item has no confidentiality note
- two items share a slug
- a testimonial has not been permission-cleared

### The publication boundary

`lib/content/queries.ts` imports `server-only`, so a client component that
reaches for the content set fails the build instead of quietly bundling it.
Everything public flows through `getPublicProjects()` / `getPublicEvents()`,
which filter on visibility *and* permission in one place.

Consequences worth knowing:

- An item with a pending permission is authored in the repo but appears on no
  page, in no sitemap, and in no `generateStaticParams` output.
- Unverified metrics are stored but can never render — `getDisplayableMetrics()`
  is the only way a component can read them.
- Anything genuinely private is simply not in the repository. A `noindex` tag
  or a hidden URL is not access control.

### Adding or changing content

Edit the relevant file in `content/`. A project is authored once; its status,
role and summary update everywhere it appears — homepage, `/work`, and each
capability route it is tagged for. To publish the enterprise automation case
study, fill in its fields and change `permissionStatus` to `approved`; no code
change is needed.

Outstanding facts, permissions and assets are tracked in
[`CONTENT_TODO.md`](./CONTENT_TODO.md).

## Routes

`/` · `/work` · `/work/[slug]` · `/software` · `/websites` · `/events` ·
`/events/[slug]` · `/community` · `/about` · `/contact` · `/resume` ·
`/privacy`, plus `not-found` and `error`.

The four capability routes share one `LensPage` component and differ only in
copy and ordering.

Filtering on `/work` and `/events` is done by the server from `searchParams`.
The filter controls are links, so they produce real shareable URLs, work
without JavaScript, are keyboard-operable by default, and ship no filter JS —
while still being a soft navigation.

## Design system

Tokens live in `app/globals.css` as HSL triplets and are consumed through
`tailwind.config.ts`. Both themes are complete, and every foreground/background
pair is checked against WCAG 2.2 AA — the ratios are recorded in a comment
beside the values. Fonts are Geist, Geist Mono and Instrument Serif via
`next/font`.

Motion is limited to 150–250ms opacity and transform changes, and is gated
behind `prefers-reduced-motion: no-preference` so a reduced-motion visitor gets
the finished state rather than a degraded one.

## Deployment

Deploys on Vercel from `main`. Set `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` and
`CONTACT_RECIPIENT_EMAIL` in the project's environment variables; the sender
address must be verified in Brevo.

Run through [`docs/release-checklist.md`](./docs/release-checklist.md) before
promoting to production — in particular the content-safety grep, which
confirms no unpublished item reached a client bundle.
