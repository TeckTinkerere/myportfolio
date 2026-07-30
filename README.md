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

The visual language is an **instrument panel**: the site is built on a
verification state machine, so it reads as a control surface rather than a
magazine. Amber on near-black is the palette of instrument displays, which is
why the brand accent stayed and the structure around it changed.

Tokens live in `app/globals.css` as HSL triplets, consumed through
`tailwind.config.ts`. Both themes are complete and every pair is checked
against WCAG 2.2 AA — measured ratios are recorded in a comment beside the
values. Note the two border tokens: `--border` is a decorative hairline at
1.3:1 and must never be the only thing marking an interactive boundary;
`--border-strong` is 3.4:1 and is what inputs and controls use, per WCAG 2.2
§1.4.11.

Type is **Archivo** for display (width axis set slightly expanded, so
headlines read as equipment labelling), **Geist** for body, and **IBM Plex
Mono** for all telemetry — statuses, dates, counts, labels.

Motion is one orchestrated hero sequence plus once-only scroll reveals, and
everything is gated behind `prefers-reduced-motion: no-preference` so a
reduced-motion visitor gets the finished composition, not a degraded one.

### Brand assets

Every icon and logo is generated from one master by a single script:

```bash
node scripts/build-brand-assets.mjs
```

| Output | Size | Used by |
| --- | --- | --- |
| `app/icon.png` | 128 | Favicon (Next's icon convention) |
| `app/apple-icon.png` | 180 | iOS home screen |
| `public/images/brand/logo.png` | 512 | Header, footer, social card |
| `public/images/brand/logo-email.png` | 128 | Transactional email |

The master lives at `assets/brand/logo-master.png` — **outside `public/`**, so
the 4.5 MB original is never deployed or served.

Two things the script handles that matter:

- It crops to the bounding box of *opaque* pixels rather than trimming on
  colour, which removes the generator watermark and the soft drop shadow
  (both low-alpha, both outside the mark) and centres the mark optically at
  every size.
- It quantises the palette. The mark is a photographic brushed-metal render,
  so a full-colour PNG of it is large; this takes the favicon from 113 kB to
  9.7 kB with no visible loss at the sizes actually rendered.

The master **must have a real alpha channel**. The mark sits on both the
near-black and the warm cream theme, so anything with a background baked in
is unusable as site chrome — it reads as a white sticker on the dark theme.

One theme correction is applied in CSS, not in the asset. On dark the mark
measures ~6.2:1 and needs nothing; on cream its champagne highlights measure
~1.05:1 and wash out, dragging the whole mark to ~2.9:1. The `.brand-mark`
class applies a mild darkening in light theme only, lifting it to ~3.9:1.

### The hero field

The signature element is a 3D node field where **every node is one published
project**, positioned by the disciplines it belongs to and coloured by its
real status. It is generated by `lib/content/system-field.ts` from the same
query layer as the pages, so it cannot drift from the truth and an
unpublished item can no more appear in it than on `/work`.

It is built in three layers:

| File | Role |
| --- | --- |
| `components/three/system-field.config.ts` | Every tunable value — radius, speed, sizes, colours, link density. Start here. |
| `components/three/system-field-static.tsx` | Server-rendered SVG projection of the same data. Ships in the initial HTML, no JavaScript. |
| `components/three/system-field-canvas.tsx` | The WebGL scene (React Three Fiber). |

three.js is ~160 kB, so it is dynamically imported with `ssr: false` after
mount: the homepage's First Load JS is 111 kB against a 109 kB baseline, and
the 3D can never affect LCP. If WebGL is unavailable, the connection is on
save-data, the device reports fewer than four cores, or JavaScript is off, the
SVG underneath simply remains — showing the same information.

To retune it, edit the config file. To remove it entirely, drop
`<SystemField />` from `app/page.tsx`; the SVG keeps working on its own.

## Deployment

Deploys on Vercel from `main`. Set `BREVO_API_KEY`, `BREVO_SENDER_EMAIL` and
`CONTACT_RECIPIENT_EMAIL` in the project's environment variables; the sender
address must be verified in Brevo.

Run through [`docs/release-checklist.md`](./docs/release-checklist.md) before
promoting to production — in particular the content-safety grep, which
confirms no unpublished item reached a client bundle.
