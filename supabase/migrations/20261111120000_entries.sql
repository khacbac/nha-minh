-- Diary entries (spec mvp.md §3.2–§3.3), one diary per account: the whole family signs in with
-- the same account. The server reaches this table with the secret key only; the app never
-- reads it directly, so RLS is on with no policies. Deleting the auth user deletes its diary.

create table public.entries (
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Made on the phone when the entry is first saved; never changes.
  id text not null check (char_length(id) between 1 and 64),
  -- A permanent id from CATEGORY_IDS (packages/types); checked by the server, not here, so a new
  -- category needs no migration.
  category_id text not null,
  title text not null check (char_length(title) between 1 and 120),
  note text check (note is null or char_length(note) <= 2000),
  -- Whole đồng.
  amount bigint check (amount is null or (amount > 0 and amount <= 999999999999)),
  occurred_at timestamptz not null,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  -- When the server last wrote the row; the app's own times are the three above.
  saved_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index entries_user_occurred_idx on public.entries (user_id, occurred_at desc);
alter table public.entries enable row level security;
