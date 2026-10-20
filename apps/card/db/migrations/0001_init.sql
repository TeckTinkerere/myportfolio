-- Card app schema. Users live in neon_auth."user" (Managed Better Auth).
--
-- Every query runs server-side through the owner role, so access control is
-- enforced in lib/data.ts (session + invite + ownership checks), not by RLS.
-- Nothing here is reachable from the browser.

create extension if not exists citext;

-- Who may use the app. Signing up with an email that is not here gets an
-- account at the auth layer but can do nothing: every write checks this table.
create table invites (
  email       citext primary key,
  is_admin    boolean not null default false,
  invited_at  timestamptz not null default now(),
  accepted_at timestamptz
);

create table profiles (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references neon_auth."user"(id) on delete cascade,
  handle       citext not null unique
               check (handle ~ '^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])$'),
  -- One JSON document each, validated by lib/card/schema.ts. Editing only
  -- ever touches draft; Publish copies it to published.
  draft        jsonb not null,
  published    jsonb,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index profiles_owner_idx on profiles (owner_id);

-- What an NFC chip or printed QR encodes: /t/<id>. Re-pointing a tag moves a
-- physical card to another profile without rewriting the chip.
create table tags (
  id         text primary key check (id ~ '^[a-z0-9]{8}$'),
  profile_id uuid references profiles(id) on delete set null,
  label      text not null default '',
  created_at timestamptz not null default now()
);
create index tags_profile_idx on tags (profile_id);

-- Contact-form submissions. Only the profile owner reads these.
create table leads (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  fields       jsonb not null,
  consent_text text not null,
  -- Daily-salted hash, used only for rate limiting. Never the raw IP.
  sender_hash  text not null,
  created_at   timestamptz not null default now()
);
create index leads_profile_idx on leads (profile_id, created_at desc);
create index leads_rate_idx on leads (sender_hash, created_at desc);
