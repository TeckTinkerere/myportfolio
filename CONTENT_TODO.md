# Content backlog

Facts that were missing when the site was rebuilt. Nothing here was guessed —
each item renders as an honest neutral state until you fill it in.

Tags: `[VERIFY]` a fact needs confirming · `[PERMISSION]` someone else must
agree · `[ASSET]` a file is missing · `[TESTIMONIAL]` needs written consent ·
`[RESUME]` résumé specific.

---

## Blocking — these hold back a whole section

### Events

`/events` currently publishes **one** record: the AI Singapore *AI for Good
(Youth) Student Facilitator* programme. That is the only event anywhere in the
old codebase with third-party documentation.

The PRD lists a candidate inventory that has **no supporting material** in this
repository — no dates, no organiser names beyond the event title, no role
confirmation, no links, no photographs:

- `[VERIFY]` AI Hackathon SG — exact role (main emcee and co-host?), date, organiser, audience size
- `[VERIFY]` Nosana Challenge — workshop instructor? date, organiser
- `[VERIFY]` Deep Research Agent workshop — assistant or facilitator? date, organiser
- `[VERIFY]` AFSG Hackathon — teaching assistant, date, organiser
- `[VERIFY]` SG Vibe Coding Hackathon — host support, date, organiser
- `[VERIFY]` AI Builders — your actual relationship to the organisation. The
  PRD is explicit that it must not read as your own company.
- `[PERMISSION]` OCBC Kids@Work co-emcee — needs employer approval before it
  can be named at all
- `[ASSET]` Event photographs. There is exactly one usable image
  (`public/images/events/event-01.jpg`) and it is not currently published.
- `[TESTIMONIAL]` An organiser quote, with written permission to publish.

**To add an event:** append an entry to `content/events/index.ts`. State the
exact role — the schema will not let participation be filed as hosting.

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

### Metrics currently withheld

These were published on the old site with no measurement method or source.
They are stored in `content/projects/localloco.ts` as `verified: false` and
cannot render. To publish one, add a `publicSourceUrl` and set `verified: true`
— the schema rejects a verified metric with no source.

- `[VERIFY]` LocalLoco "reduced spam by 95%" — measured how, over what period?
- `[VERIFY]` LocalLoco "99.5% uptime" — from which monitor?
- `[VERIFY]` LocalLoco "page load under 2 seconds", "updates within 500ms"
- `[VERIFY]` StartupLink "100% email verification success rate"
- `[VERIFY]` "50,000+ lines of code", "500+ GitHub contributions" — these were
  in `lib/professional-profile.ts` and are not carried over.

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
