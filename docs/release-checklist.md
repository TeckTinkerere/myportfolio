# Release checklist

Run before any production deploy.

## 1. Automated

```bash
npm run verify
```

Runs typecheck → lint → tests → build. All four must pass. `next.config.mjs`
no longer suppresses type or lint errors, so a failure here is real.

The build also validates content: `content/projects/index.ts` and
`content/events/index.ts` parse their Zod schemas at module scope, so an
invalid entry throws during static generation and fails the build with the
offending slug and field named.

## 2. Content safety

The one check that must never be skipped. After `npm run build`:

```bash
npm run check:leaks
```

Every term must report `PASS`.

Scope matters here. The script searches `.next/static` (client bundles) and
the prerendered `.html` / `.rsc` / `.body` files under `.next/server/app` —
that is everything a visitor can actually receive. It deliberately does *not*
search `.next/server/**/*.js` or `.next/cache`: those are server-side modules
and build artifacts that are never sent to a browser, and they legitimately
contain things like `process.env.BREVO_API_KEY` (the variable name, read at
runtime) and the unpublished case-study scaffold.

Also confirm the sitemap lists only published work:

```bash
grep -c "<loc>" .next/server/app/sitemap.xml.body
```

## 3. Manual

Run `npm run dev` and check:

- [ ] 360px — no horizontal scrolling on any route
- [ ] Tablet and 1366px
- [ ] Light theme and dark theme, and the toggle in both directions with no flash
- [ ] Keyboard only: skip link is the first tab stop; every control is reachable; focus is always visible and never hidden under the sticky header
- [ ] `prefers-reduced-motion: reduce` — content is complete, not degraded, and the hero field holds a single static frame
- [ ] Hero field: nodes visible and drifting; colours match the status legend in the panel beneath it
- [ ] Hero field with JavaScript disabled — the SVG projection still renders the same nodes
- [ ] Hero field on a mid-range phone — no dropped frames while scrolling past it
- [ ] `/work` filters change the URL and still work with JavaScript disabled
- [ ] `/contact` shows the right conditional fields per enquiry type, and `?type=event` preselects
- [ ] Submit an invalid form: errors are announced and typed data is preserved
- [ ] Images disabled — no layout collapse, alt text is meaningful

## 4. Content QA

- [ ] Every published item's role and status is still accurate
- [ ] No unverified number is on a page
- [ ] Dates and organisation names are correct
- [ ] External links resolve (the two GitHub links from the old site returned 404 — see `CONTENT_TODO.md`)
- [ ] Social preview renders: check `/opengraph-image`

## 5. Environment

- [ ] `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `CONTACT_RECIPIENT_EMAIL` set in Vercel
- [ ] Sender address verified in Brevo
- [ ] Send one real test enquiry and confirm it arrives, and that Reply-To works
- [ ] `NEXT_PUBLIC_SITE_URL` unset in production; set on preview environments

## 6. After deploy

- [ ] Old routes redirect: `/projects`, `/all-projects`, `/skills`, `/hall-of-fame`, `/visionary-wall`
- [ ] `/sitemap.xml` and `/robots.txt` resolve
- [ ] Run Lighthouse on `/` and one case study — performance, accessibility, best practices and SEO all ≥ 90
