-- Rate limiting for sign-in, sign-up and password-reset requests.
--
-- The auth SDK calls Neon Auth from the server without the visitor's IP, so
-- Neon's own limiter sees every attempt as coming from Vercel. These rows let
-- the app limit attempts per email and per IP itself. Keys are salted
-- SHA-256 hashes: no raw IPs or emails are stored. Rows older than a day are
-- pruned by lib/throttle.ts.
create table auth_attempts (
  key_hash   text not null,
  created_at timestamptz not null default now()
);
create index auth_attempts_key_idx on auth_attempts (key_hash, created_at desc);
create index auth_attempts_created_idx on auth_attempts (created_at);
