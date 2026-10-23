-- Invites become one-time links, and membership is bound to an account id.
--
-- Before: membership was "signed in with an email on the invite list". The
-- auth server lets anyone register any email without verifying it, so a
-- pending invite (including an admin one) could be claimed by whoever
-- registered that email first, directly against the auth server.
--
-- After: an invite carries a random token (only its SHA-256 is stored), sent
-- by the admin out of band. Redeeming it binds the invite to the account that
-- redeemed it, and lib/session.ts accepts only that account id.

alter table invites
  add column token_hash       text,
  add column token_expires_at timestamptz,
  add column user_id          uuid unique references neon_auth."user"(id) on delete set null;

-- Accounts that already joined keep access: bind them to their account.
update invites i
   set user_id = u.id
  from neon_auth."user" u
 where i.accepted_at is not null
   and i.user_id is null
   and lower(u.email) = lower(i.email::text);
