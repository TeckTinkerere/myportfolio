# NFC card builder — plan

A self-hosted digital business card for me and a few friends: tap an NFC card,
a profile page opens, "Save contact" drops a vCard into the phone. It replaces
my One Good Card (OGC) profile. It is functionally comparable to OGC, but the
code, look and name are my own.

Status (2026-10-20): Phase 1 is built in `apps/card` and live at
https://card.mohdaslam.dev (Vercel project `mohdaslam-card`, Neon project
`mohdaslam-card`). See [apps/card/README.md](../apps/card/README.md).

---

## 1. Decisions

| Question | Decision | Why |
|---|---|---|
| Where it lives | New app `apps/card`, deployed as **`card.mohdaslam.dev`**. `mohdaslam.dev/card` permanently redirects to my own card. | Same pattern as `apps/emcee`. The card app needs auth, a database, uploads and its own security headers; the portfolio stays static and fast, and a bad deploy of one can't break the other. |
| Stack | Next.js **16** (App Router) + Tailwind + `@mohdaslam/ui`. | Neon's auth SDK requires Next 16. The other apps stay on 15; the card app has its own copy of Next. |
| Data, auth, files | **Neon**: Postgres, Managed Better Auth (email + password), Object Storage for photos and logos. | Changed from Supabase on 2026-10-19: the Supabase account was at its 2-free-project limit. Neon scales to zero and wakes on the next query, so there is no week-long pause to work around. |
| Who can sign up | **Invite-only.** An `invites` allowlist; anyone else gets "not invited". | Keeps it personal use, stops strangers hosting content on my domain. |
| What the NFC chip stores | `https://card.mohdaslam.dev/t/<tagId>`, never the profile URL. | The tag ID maps to a profile in the database, so a card can be re-pointed or handed to a friend without rewriting the chip. OGC works the same way. |

**A tap must never wait on a cold database.** Public card pages are statically
rendered and revalidated on publish (`revalidatePath`), so a tap is served
from Vercel's cache. Only the `/t/<tag>` redirect queries the database (a
cold Neon compute wakes in well under a second).

---

## 2. Legal guardrails (read before building)

I'm not a lawyer and this isn't legal advice. These are the lines to stay
inside; if this ever becomes a paid product, get it reviewed properly.

**Features are fair game. OGC's code, design assets and brand are not.**
Copyright protects how something is expressed, not the idea of a profile page
with a Save Contact button. vCards, NFC URLs, QR codes, link lists and contact
forms are generic features every competitor has (Linq, Popl, Blinq, HiHello).

OGC's Terms of Service forbid copying, duplicating, or making derivative works
from any part of their Service without written permission. In practice, a
clean-room build means:

- **Don't** copy their HTML, CSS, JS, icons, illustrations, template layouts,
  colour schemes or wording. Don't open their editor to replicate a screen
  pixel-for-pixel. Write the requirements as a feature list (section 4) and
  design from that.
- **Don't** scrape or automate their dashboard or API. Move your own profile
  content by hand: retype the text and re-upload your original photo/logo
  files. That content is yours.
- **Don't** use "One Good Card", "OGC", their logo or anything resembling their
  trade dress in the product name, UI, domain or marketing. Mentioning them as a
  reference in this internal doc is fine.
- **Do** your own templates, your own name for the product, and your own icons
  (Lucide is already in the stack, and Simple Icons for brand logos — check each
  brand's logo guidelines).

**The physical card.** The card is your property and rewriting its chip is
allowed. Many vendors **lock** (write-protect) the chip at the factory, and a
locked tag can't be rewritten. Don't try to get around a lock. Check first
(phase 0); if it's locked, use blank cards.

**Personal data (Singapore PDPA).** Once friends' profiles and visitors' lead
form submissions sit on my server, treat it as if PDPA applies, even if the
personal/domestic exemption might cover part of it:

- A privacy notice at `card.mohdaslam.dev/privacy`: what is collected, why,
  who can see it, how to get it deleted.
- Friends can export and permanently delete their own profile and data.
- Contact forms (phase 1) need an explicit consent checkbox naming whose card the
  details are going to. Delete leads on request, and set a retention period.
- Visitor analytics (phase 3) should be cookieless and IP-hashed. Don't
  fingerprint.
- Secrets stay in env vars. Ownership is checked on every query.

**Hosting terms.** Vercel's Hobby plan is for non-commercial personal use. My
own card is fine. If friends use it mainly for their businesses, or I ever
charge, re-check Vercel's and Neon's terms (likely means Vercel Pro).

**Embeds.** YouTube, Spotify and Google Maps embeds follow their own terms;
use the official embed URLs. Don't rehost their content.

---

## 3. Architecture

```
NFC chip ─┐
QR code ──┼─► card.mohdaslam.dev/t/<tagId> ──307──► /<handle>  (static, cached)
Link ─────┘                                              │
                                                         ├─ /<handle>/vcard  → .vcf download
                                                         └─ /<handle>/qr.svg → QR code

/login   email + password (invite-only)
/edit    builder: widget list + live phone preview, Save draft / Publish
/admin   (me only) invites, NFC tags, reassign tags
```

Use 307 (temporary), not 308, for `/t/<tagId>` so phones and caches never
remember an old target after a tag is reassigned.

**Data model (Postgres):**

```sql
profiles  id uuid pk, owner_id uuid → auth.users, handle text unique,
          draft jsonb, published jsonb, published_at timestamptz,
          created_at, updated_at
tags      id text pk (8-char random, e.g. "k3f9x2qa"), profile_id uuid null,
          owner_id uuid, label text, created_at
invites   email text pk, invited_by uuid, accepted_at timestamptz
leads     id uuid pk, profile_id uuid, fields jsonb, consent_text text,
          created_at   -- contact form submissions, owner-read only
```

- A profile's content is one JSON document (`theme`, `meta`, `widgets[]`),
  validated by a shared **Zod schema**, the same pattern as
  `lib/content/schema.ts` in the portfolio. Draft and published are separate
  columns, so editing never changes the live card until Publish.
- Each user can have several profiles from day one (work, personal, events).
  OGC charges for this as "multi-profile".
- Reserved handles (`t`, `edit`, `login`, `admin`, `api`, `privacy`…) can't be
  claimed.
- Access control lives in server code, not RLS: the browser never talks to
  the database. Every query that touches a profile includes the owner's id in
  its `WHERE` clause, and the public site reads only `published`.

---

## 4. What my current card actually uses

Audited from `ogc.link/u/MohamedAslam` on 2026-10-19. This is the baseline
Phase 1 has to match.

| On the OGC card today | Phase 1 equivalent |
|---|---|
| Round profile photo over a curved dark header, blue gradient background | Header widget + theme (my own layout and colours, not theirs) |
| Name and title (no company shown) | Header fields; company is optional |
| Quick-action row: call, email, share | Quick actions (configurable: call, email, WhatsApp, share) |
| QR icon top-right → QR modal | QR modal |
| Email and phone rows | Contact fields widget |
| Section heading with an underline | Heading widget |
| Two-line tagline text block | Text widget |
| "My Portfolio" link | Link button widget |
| WhatsApp, LinkedIn (personal), email again, LinkedIn for two companies | Contact + social widgets, each with its own label |
| "Get your burning questions here!" → form: name, designation, company, email, mobile, message, plus a consent line | **Contact form widget**. This moves into Phase 1 (it was Phase 4). |
| Save Contact button | vCard download |
| OGC logo in the footer, generic "View this digital business card on One Good Card" link preview | Gone: no third-party branding, custom title, description and OG image |

**Content to fix while moving it over:**

- "My Portfolio" points to the old `myportfolio-aslam.vercel.app`. Change it
  to `https://mohdaslam.dev`.
- "A Builder and a Innovator" should be "A Builder and an Innovator".
- Email and phone each appear twice (top rows and the lower list). Keep one
  of each.
- The title says Chief Executive Officer with no company. Add the company
  (LocalLoco?) or use a profile per role (multi-profile).
- The card's font is GT Walsheim, a commercial font. Use a free one (e.g. a
  Google Font) rather than copying it.

---

## 5. Phases

### Phase 0: Prep (about an evening)

- [x] Write down every field, link and setting on my current OGC card
      (done, section 4).
- [ ] Test whether the OGC card's chip is locked: in the **NFC Tools** app
      (iOS/Android), use *Read* and check "Writable". Also note the URL it
      holds.
- [ ] If it's locked: order blank **NTAG215/216** PVC cards (cheap in bulk),
      or custom-printed ones from a printer that ships them unlocked. Until
      they arrive, keep the free OGC profile with one link pointing to the new
      card.
- [ ] Pick a product name (not "OGC anything").
- [x] Create the database, auth and storage (Neon project `mohdaslam-card`).
- [x] Create the Vercel project; add `card.mohdaslam.dev` as a domain.

### Phase 1: The card page and builder (this is the MVP)

The goal: me and friends each have a card that looks as good as OGC Pro,
editable by its owner, opening instantly on tap.

**Public card page**

- Header: banner/cover image, profile photo, name, pronouns, title, company,
  company logo.
- Quick-action row under the name: choose any of call, email, WhatsApp,
  share.
- Big sticky **Save Contact** button → vCard 3.0 (most compatible with iOS and
  Android) including photo, phones, emails, URL, address, org, title, note.
- **Share** button: native share sheet, plus a QR code modal for showing the
  card to someone who doesn't have NFC.
- Widgets, in any order, each can be hidden:
  - Heading (section title with divider)
  - Text / bio (short rich text: bold, italic, links)
  - Contact fields: phone, email, WhatsApp, Telegram, website, address
    (each tappable: `tel:`, `mailto:`, `wa.me`, map link)
  - Social links: icon row (LinkedIn, GitHub, Instagram, X, TikTok,
    YouTube, Facebook, custom)
  - Link buttons: label + URL + optional icon
  - Embeds: YouTube, Spotify
  - Calendar/booking link (Calendly, Cal.com, Google Calendar)
  - **Contact form** (my current card has one): a button that opens a form.
    The owner chooses which fields show (name, designation, company, email,
    mobile, message), with a consent line naming the owner. Submissions are
    stored for the owner and emailed to them (Resend). Spam protection with
    Cloudflare Turnstile, plus a rate limit.
- Styling: 3 original templates, brand colour, button style, font pair,
  banner or solid/gradient background, light/dark.
- No third-party branding. Optional tiny "Made with …" footer, owner can turn
  it off.
- Custom page title, description and OG image for link previews.
- Fast: static HTML, images through `next/image`. Target under 1s on 4G from
  tap to first paint.

**Builder (`/edit`)**

- Left: widget list, drag to reorder (`@dnd-kit`), add/remove/hide, a form for
  each widget. Right: live phone-frame preview from the same render component
  the public page uses.
- Autosave drafts; **Publish** copies draft → published and revalidates the
  page.
- Image upload with client-side crop/resize (photo square, banner 3:1), max
  2 MB, stored in Neon Object Storage.
- Handle picker with live availability check.
- Inbox: contact form submissions, with delete and CSV export.
- Settings: download my data (JSON), delete my profile.

**Admin (`/admin`, me only)**

- Invite by email; see who joined.
- Create NFC tag IDs, assign them to profiles, show the exact URL to write to
  the chip and a printable QR code.

**Definition of done**

- Tapping a written card on an iPhone and an Android phone opens the right
  profile; Save Contact adds a correct contact with photo on both.
- A friend can sign in from an invite, build and publish a card, and can't
  touch anyone else's.
- Reassigning a tag changes where it opens without rewriting the chip.
- Tests: Zod schema, vCard output, handle rules, link building (done, 31
  unit tests). Still to add: a Playwright smoke test of tap → page → vCard.
- The card page passes the same `verify` gate as the other apps.

### Phase 2: More widgets and sharing

- Image gallery (grid/slideshow), file sharing (PDF/deck download),
  product/service list with CTA, Google Maps embed with opening hours.
- **Apple Wallet and Google Wallet passes** with the QR code. Apple needs a
  paid Apple Developer account for the pass-signing certificate.
- Email signature generator (HTML snippet).
- Downloadable, styled QR codes (colours, logo in the centre).
- Profile switcher when one person has multiple cards.

### Phase 3: Analytics

- Per-profile counts: views, taps (via `/t/` hits), Save Contact clicks, link
  clicks. Show tap vs QR vs link source.
- Cookieless: a daily-salted hash of IP + user agent. No third-party trackers.
- Simple dashboard: last 30/90 days, top links.

### Phase 4: Contacts manager

The basic contact form and inbox ship in Phase 1. This phase turns the inbox
into a contacts manager.

- Notes, tags and follow-up status on each contact.
- "Exchange contact" mode: after saving my vCard, the visitor is offered the
  form to send theirs back.
- Retention setting (e.g. auto-delete after 12 months).

### Phase 5: Optional, only if I actually want it

- Scan a paper business card into a contact (camera + OCR, e.g. an LLM vision
  call) → contacts list.
- CRM sync (HubSpot) via webhook.
- Custom domains per friend.
- Team branding (locked colours/logo across a group).

**Not planned:** selling physical cards, a deal pipeline, invoicing, email
verification, live event printing. These are OGC's business lines, not things
a personal card needs.

---

## 6. Open questions

1. Name and subdomain: `card.mohdaslam.dev`, or something like
   `tap.mohdaslam.dev`?
2. Do friends' cards live under my domain long term, or should they get
   their own domains later (phase 5)?
3. Is the OGC chip locked? (Phase 0 answers this.)
4. Search engines: should cards be indexable (`index`) or `noindex` by default?
   Suggest `noindex` for friends' cards, owner can opt in.
