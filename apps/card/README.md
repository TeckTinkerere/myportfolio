# card.mohdaslam.dev

NFC digital business cards for me and a few invited friends. Tap a card, a
profile page opens, Save contact downloads a vCard. Plan and phases:
[docs/nfc-card-plan.md](../../docs/nfc-card-plan.md).

## Stack

- **Next.js 16**. The other apps are on 15; this one is on 16 only because
  `@neondatabase/auth` requires it. It has its own `next` in
  `apps/card/node_modules`, so the rest of the monorepo is unaffected.
- **Neon** (project `mohdaslam-card`, AWS Singapore):
  - Postgres for profiles, tags, invites and contact-form submissions.
    Schema: [db/migrations/0001_init.sql](db/migrations/0001_init.sql).
  - Managed Better Auth (Neon Auth), email and password, invite-only.
  - Object Storage bucket `card-media` (public-read) for photos, banners and
    logos.

## Quick start

```bash
npm ci                                   # from the repository root
cp apps/card/.env.example apps/card/.env.local   # then fill it in
npm run dev:card                         # http://localhost:3002
```

## How it fits together

| Path | What it is |
|---|---|
| `/<handle>` | Public card. Static, revalidated when the owner publishes. |
| `/<handle>/vcard` | Save contact (vCard 3.0, photo inlined). |
| `/t/<tagId>` | What an NFC chip stores. 307 to the card it is assigned to. |
| `/login` | Sign in, or create an account if your email is invited. |
| `/edit` | Your cards; `/edit/<id>` is the builder with a live preview. |
| `/edit/<id>/inbox` | Contact-form submissions, CSV export. |
| `/admin` | Invites and NFC tags (admins only). |

**Access control.** All queries run server-side. Every editor action calls
`requireMember()` (session plus an entry in `invites`) and passes the
member's id into the query, so ownership is part of the `WHERE` clause.
The public sign-up endpoint is blocked; accounts are created by the login
page's server action after the invite check.

**Card documents.** A card is one JSON document validated by
[lib/card/schema.ts](lib/card/schema.ts). Profiles keep a `draft` (autosaved
by the editor) and a `published` copy (what visitors see).

**Images** must live in the bucket: `saveCard` rejects any other URL, and
`next.config.mjs` only allows that host.

## Writing an NFC tag

1. Admin → NFC tags → New tag, and pick the card it should open.
2. In the NFC Tools app: Write → Add a record → URL → paste the tag URL →
   Write, and hold the card to the phone.
3. To move the physical card to another profile later, change it in Admin.
   The chip does not need rewriting.

## Deploying

Vercel project `mohdaslam-card`, Git-linked to this repo like the emcee
project: root directory `apps/card`, production branch `main`, domain
`card.mohdaslam.dev`. Every variable from `.env.example` is set on the
project (production and preview), with
`NEXT_PUBLIC_SITE_URL=https://card.mohdaslam.dev`. The domain is in Neon
Auth's trusted domains.

Pushes to `main` deploy it. Without a push, deploy from the repository root
with `vercel deploy --prod` after linking to `mohdaslam-card`.

## Not done yet

- Email notifications for contact-form submissions need `RESEND_API_KEY` and
  `RESEND_FROM`. Without them, submissions still land in the inbox.
- No CAPTCHA yet: the contact form relies on a honeypot plus hourly rate
  limits. Add Cloudflare Turnstile if spam shows up.
- Replaced or removed images stay in the bucket. They are small; a cleanup
  job can come later.
