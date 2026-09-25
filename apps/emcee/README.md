# emcee.mohdaslam.dev

A standalone hosting site: rooms hosted, how a room is run, run sheets and a
booking route. Deployed separately from the portfolio and deliberately does
not link back to it — see the [root README](../../README.md) for the Vercel
setup.

The hosting record lives in [`content/hosting.ts`](content/hosting.ts) and
the booking contact in [`content/site-config.ts`](content/site-config.ts).
Illustrations come from `@mohdaslam/ui/illustrations`, shared with the
portfolio.

## Quick start

```bash
npm ci                                    # from the repository root
npm run dev --workspace @mohdaslam/emcee  # :3001
```

## What a run sheet is

Not a programme. A programme tells an audience what is happening; a run sheet
tells the person at the front what to say, how long they have, and how to get
from one thing to the next. Every design decision here follows from where it
is read: at arm's length, on a phone, in a dim room, in the two seconds
between looking back up at an audience.

That is why the clock time is the largest thing on a segment card and sits in
its own column, why every card orders its sections identically, and why the
sticky bar answers one question — what is on now, and how long is left.

Segments carry host notes, tech cues, speaker details including how a name
should be *said*, and an authored handoff line. Transitions get a field of
their own because they are where a room's energy is lost.

## Two rules the schema enforces

**Clock times are never authored.** A sheet declares one start time and a
duration per segment; every displayed time is computed from those in
[`lib/running-order.ts`](lib/running-order.ts). Re-cut a segment and the rest
of the evening moves with it, instead of leaving eight hand-typed times
quietly wrong — which is the classic run-sheet failure.

**A published sheet naming a person needs `approved` permission**, not
`not-required`. `not-required` asserts nobody had to be asked, which cannot
be true of a named speaker. This mirrors the rule the portfolio applies to
testimonials.

Both are enforced by Zod at module scope in
[`content/index.ts`](content/index.ts), so a violation fails `next build` and
names the offending sheet and field.

## Publishing a sheet

Sheets pass through the same `isPublished()` as everything on the portfolio —
imported from `@mohdaslam/content-rules`, not restated here. A sheet marked
`private` has no page, no sitemap entry and no `generateStaticParams` output.

**There is no login on this site.** Publishing a sheet publishes the host
notes on it. A note that would embarrass an organiser belongs in a private
sheet, not behind a URL nobody has been given.

To add a sheet for a real event: copy
[`content/runsheets/tech-meetup-template.ts`](content/runsheets/tech-meetup-template.ts),
set `sheetType: 'event'` with the date, and leave `visibility: 'private'`
until the organiser has seen what the page says.

`eventUrl` is an absolute URL rather than a slug. This app holds no copy of
the portfolio's event records, so it cannot check that a slug resolves to
something published — and a link it cannot verify is one it should not be
constructing. Paste a URL you have actually opened.

## Client JavaScript

One component: the live clock in the sticky bar. The page is statically
generated, so the server has no idea what time it is when someone opens it.

It is kept as small as that implies — no timers on the cards, no per-segment
highlighting, no scroll tracking. One string that changes every fifteen
seconds and a link to the segment it names. The first render matches the
server exactly (the programme's own start and end times) and the live reading
replaces it after mount, so nothing shifts and the bar still reads correctly
with JavaScript off; it just stops moving.

Only four fields per segment cross into the client bundle — id, title, and
the two offsets. Host notes, cues and speaker details stay on the server.

Time is compared as a wall clock rather than a timestamp. A run sheet is a
schedule for a day, and the phone in the host's hand is already set to the
room's timezone; converting through one would add a field to get wrong
without changing the answer.

## Routes

`/` (home: hero, rooms, approach, run sheets, booking) · `/[slug]` (a run sheet), plus `not-found`, `robots.txt` and `sitemap.xml`.
