# Content backlog

Facts that were missing when the site was rebuilt. Nothing here was guessed —
each item renders as an honest neutral state until you fill it in.

Tags: `[VERIFY]` a fact needs confirming · `[PERMISSION]` someone else must
agree · `[ASSET]` a file is missing · `[TESTIMONIAL]` needs written consent ·
`[RESUME]` résumé specific.

---

## Blocking — these hold back a whole section

### Enterprise automation case study

`content/projects/enterprise-automation.ts` exists as a scaffold with
`permissionStatus: 'pending'`, so it is excluded from every public query and
does not appear anywhere on the site.

- `[VERIFY]` Does this role exist, and what was the actual scope? Nothing in
  the old portfolio references it.
- `[VERIFY]` Your exact role, the timeframe, and what you personally owned
- `[PERMISSION]` **Employer approval for a sanitised account.** Without this it
  stays unpublished. A hidden URL is not a substitute for permission.
- Once confirmed: fill in `responsibilities`, `constraints`, `outcomes`,
  `longSummary`, then change `permissionStatus` to `approved`. It will publish
  automatically. No code changes needed.

Do **not** add internal screenshots, source code, internal URLs, credentials,
customer data, internal product names or unapproved employer metrics.

### EcoRamadan

Published as a compact entry. The PRD asks for a full case study; there was one
sentence of source material, so the rest is not written.

- `[VERIFY]` Dates the pilot ran
- `[VERIFY]` Where it ran, and the partner organisations involved
- `[PERMISSION]` Naming those partners publicly
- `[VERIFY]` Volunteer count, and **the bottle/cap totals with their source.**
  The PRD flags these as needing consistent sourcing. No number is published
  until it has one.
- `[VERIFY]` What did not work, and what a future edition should change
- `[ASSET]` Photographs, with permission — no identifiable individuals without
  their consent
- Once written, set `tier: 1` and add `longSummary`.

---

## Non-blocking

### Events

`/events` now publishes **13** records (added 2026-07-30 from Mohamed's own
event log) spanning all five roles: host/emcee, co-host/organiser, workshop
instructor, facilitator/TA, and event operations support. Multi-role events
(e.g. Agent Forge: Build OpenClaw AI Assistant, Daytona HackSprint Singapore)
use `secondaryRoles` so every role genuinely performed is credited in the
ladder and filters, not just the primary one.

- `[VERIFY]` **Organiser names.** The source data gave event names, dates,
  roles and detailed responsibilities, but organiser was inferred from the
  event title/description rather than stated as its own field. Most are
  confident (e.g. "MeDo Singapore Vibe Coding Hackathon" → MeDo Singapore;
  Nosana Builders Challenge → Nosana). Worth a second look:
  `agentfield-day-autonomous-backend-hackathon` (organiser guessed as AI
  Builders), the three `singapore-ai-founders-vip-dinner*` /
  `ai-founders-vip-dinner-google-singapore` entries (guessed as "Singapore AI
  Founders"), and `ai-for-everyday-work` (guessed as AI Builders, least
  confident of the twelve).
- `[VERIFY]` Whether `medo-singapore-vibe-coding-hackathon` is the same event
  the PRD candidate list called "SG Vibe Coding Hackathon" — treated as the
  same event here.
- `[VERIFY]` Still unconfirmed and not published: **AI Hackathon SG** (main
  emcee and co-host?), **AFSG Hackathon** (teaching assistant?) — no dates or
  organiser details exist for either yet.
- `[PERMISSION]` **OCBC Kids@Work co-emcee** — needs employer approval before
  it can be named at all.
- `[ASSET]` Event photographs. There is exactly one usable image
  (`public/images/events/event-01.jpg`) and it is not currently published on
  any event. None of the 13 published events has a cleared photo.
- `[TESTIMONIAL]` No organiser quote has permission to publish yet.
- No event has `hasDetailPage: true` — `/events/[slug]` still generates
  nothing. The inline responsibility list on `/events` covers what a detail
  page would add; revisit once photos or a testimonial are cleared.

**To add or correct an event:** edit `content/events/index.ts`. `role` is
the primary role (drives the card's proof verb and the URL filter);
`secondaryRoles` credits any other roles genuinely performed at the same
event; `roleLabel` should state all of them in full, matching the wording in
`EVENT_ROLE_LABELS`. The schema will not let participation be filed as
hosting.

### Metrics currently withheld

These were published on the old site with no measurement method or source.
They are stored in `content/projects/localloco-app.ts` as `verified: false`
and cannot render. To publish one, add a `publicSourceUrl` and set
`verified: true` — the schema rejects a verified metric with no source.

- `[VERIFY]` LocalLoco "reduced spam by 95%" — measured how, over what period?
- `[VERIFY]` LocalLoco "99.5% uptime" — from which monitor?
- `[VERIFY]` LocalLoco "page load under 2 seconds", "updates within 500ms"
- `[VERIFY]` StartupLink "100% email verification success rate"
- `[VERIFY]` "50,000+ lines of code", "500+ GitHub contributions" — these were
  in `lib/professional-profile.ts` and are not carried over.

### LocalLoco for Business — marketing claims (added 2026-07-31)

`info.localloco.sg` (the merchant marketing site, `localloco-business.ts`)
states specific traction numbers — "50+ Businesses joined", "200+ Deals
posted", "1,000+ Community members" — and shows five named merchant
testimonials with attributed names, business names and neighbourhoods.

**None of this is published.** `www.localloco.sg`, the actual consumer app,
showed "No deals available yet" when checked the same day — which
contradicts the marketing page's numbers closely enough that they cannot be
treated as verified. This may be placeholder copy that was never swapped
for real figures, or it may be real and just not reflected in the app yet;
either way it needs a source before it can go on the portfolio.

- `[VERIFY]` Are the "50+ / 200+ / 1,000+" figures real, and if so, current
  as of what date? Add `publicSourceUrl` per metric before publishing any of
  them.
- `[TESTIMONIAL]` Each of the five merchant quotes needs written permission
  from the named person before it can be quoted anywhere, per PRD s8.7 —
  same rule as every other testimonial on this site.

### Repository links

- `[VERIFY]` The LocalLoco and StartupLink repository URLs in the old data
  (`github.com/mohamedaslam/local-loco`, `.../polystart-connect`) both return
  **404** — that namespace is not yours. Your handle is `TeckTinkerere`. Supply
  the correct URLs and add them as `repository` evidence links, or leave them
  off. The live demos work and are published.

### Dates

- `[VERIFY]` Several archive entries use a descriptive `timeframeLabel`
  ("Personal project", "Singapore Polytechnic coursework") because no date was
  recorded anywhere: Recenter, KreatorsNest, TrustLens, EventureSG, DevOmegle,
  DevMegle, CyDists, and both coursework projects.
- `[VERIFY]` EcoRamadan shows "Dates to be confirmed" on its card.

### Résumé

- `[RESUME]` No PDF exists. `/resume` is print-styled so it can be saved as a
  PDF today, and the download button is hidden rather than pointing at a 404.
  To enable it: add the file to `public/resume/` and set `resumePdf` in
  `content/profile.ts`.
- `[VERIFY]` `resumeLastUpdated` in `content/profile.ts` is set to `2026-07`.

### Profile facts

- `[VERIFY]` The PRD describes "working in enterprise technology". The old site
  has no record of it, so it is not asserted anywhere. Confirm and it can go
  into `content/profile.ts`.
- `[VERIFY]` LocalLoco status is published as `prototype` and StartupLink as
  `in-development`. Confirm both, or change `status` in their content files.
- `[VERIFY]` LocalLoco role reads "co-founder", not "CEO" — the old about page
  said Chief Executive Officer, which reads as inflated for a prototype.
  Change it if you disagree.

### Removed content

- The 12 "Visionary Wall" startup ideas were deleted at your request. **They
  remain in this repository's git history**, along with the plaintext password
  `thefutureinnov` that gated them, and the repo is public. Deleting the files
  does not unpublish them. Rewriting history is a separate, destructive
  operation — say the word if you want it.
- `[ASSET]` Four certificate images have no matching entry and are unused:
  `ntucEXCEL.png`, `nusgurucomp.png`, `reactessentials.png`, `rvi-1.png`. Add
  them to `content/recognition.ts` or delete the files.
