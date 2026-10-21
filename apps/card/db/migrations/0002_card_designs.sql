-- Printed card designs (front and back), one per digital card. The document
-- is validated by lib/design/schema.ts. Deleting a card deletes its design.
create table card_designs (
  profile_id uuid primary key references profiles(id) on delete cascade,
  doc        jsonb not null,
  updated_at timestamptz not null default now()
);
