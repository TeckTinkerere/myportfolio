# mohdaslam.dev — workspace

Two separately deployed sites that share one design system.

```
apps/
  site/              mohdaslam.dev        — the portfolio
  emcee/             emcee.mohdaslam.dev  — event hosting run sheets
packages/
  ui/                tokens, Tailwind preset, cn, Section, theme plumbing
  content-rules/     visibility, permission and the isPublished() gate
```

## Why two apps rather than one

The run sheets started as `/emcee` on the portfolio. They were split out
because they are used differently: a run sheet is an operating document read
off a phone while a room waits, and it should not be coupled to a deploy of a
portfolio page. Separate Vercel projects mean a change to one site cannot
break or redeploy the other.

What they must still agree on is shared, not copied:

- **`packages/ui`** — every colour, type scale and component class. A token
  moves in one file and both sites move with it.
- **`packages/content-rules`** — what "published" means. Both sites gate
  their content through the same `isPublished()`. Two copies of that rule is
  exactly how one site starts publishing something the other would withhold.

`/emcee` and `/emcee/:slug` on the portfolio are permanent redirects to the
emcee site, so links shared before the split still work.

## Quick start

```bash
npm ci
```

One install at the root links both apps and both packages.

| Command | What it does |
| --- | --- |
| `npm run dev` | Portfolio on :3000 |
| `npm run dev:emcee` | Emcee site on :3001 |
| `npm run verify` | Full gate for both apps |
| `npm run verify --workspace @mohdaslam/site` | Just the portfolio |
| `npm run verify --workspace @mohdaslam/emcee` | Just the emcee site |

CI runs the full gate for both apps on every push, even when a change touches
only one — a change to a shared package can break the other app, which is
precisely the failure a per-app pipeline would let through.

## Shared packages

Both packages ship **TypeScript source**, not build output. Each app
therefore needs three things, and all three are already wired:

1. `transpilePackages` in `next.config.mjs`
2. `../../packages/ui/src/**` in the Tailwind `content` globs, so Tailwind
   sees classes used inside the package
3. `moduleNameMapper` entries in `jest.config.js`, so Jest compiles them
   rather than skipping them as `node_modules`

Two deliberate quirks worth knowing before editing them:

- **`@mohdaslam/ui` has no barrel.** Import from the subpath —
  `@mohdaslam/ui/cn`, `@mohdaslam/ui/section`. A barrel made every
  `import { cn }` drag `ThemeToggle`, `next-themes` and two lucide icons into
  whatever chunk asked for a class merger: about 10 kB on every route with
  site chrome. The `exports` map has no `"."` entry so this cannot regress by
  accident.
- **CSS is imported by relative path**, not package specifier —
  `@import '../../../packages/ui/src/styles.css'`. `postcss-import` resolves
  with its own resolver and does not read a package's `exports` map. It must
  run before Tailwind, which is why each app's `postcss.config.mjs` lists it
  first: the shared stylesheet uses `@layer` and `@apply`, and Tailwind can
  only process those once the import has been inlined.

Fonts are declared per app rather than shared. `next/font` has to be called
from the app for the compiler to self-host the files, and each app is
entitled to its own weights.

## Deployment

Two Vercel projects from this one repository. Both need their **Root
Directory** set, which is a dashboard setting and not something in this repo:

| Project | Root Directory | Domain |
| --- | --- | --- |
| portfolio | `apps/site` | `mohdaslam.dev` |
| emcee | `apps/emcee` | `emcee.mohdaslam.dev` |

Leave "Include files outside of the Root Directory" enabled — it is on by
default for a monorepo and is what lets each app reach `packages/`.

Environment variables:

| Variable | Project | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | both | The host that project actually serves. |
| `NEXT_PUBLIC_EMCEE_URL` | portfolio | Target of the `/emcee` redirects. Defaults to `https://emcee.mohdaslam.dev`. |
| `NEXT_PUBLIC_PORTFOLIO_URL` | emcee | Used for the footer link back. Defaults to `https://mohdaslam.dev`. |
| `BREVO_*`, `CONTACT_RECIPIENT_EMAIL` | portfolio | Contact form — see [`apps/site/README.md`](apps/site/README.md). |

## The two sites

- [`apps/site/README.md`](apps/site/README.md) — content model, the
  publication boundary, project sharing and short links, the design system,
  the hero field, contact form setup.
- [`apps/emcee/README.md`](apps/emcee/README.md) — the run-sheet model, why
  clock times are computed rather than authored, and what publishing a sheet
  actually exposes.
