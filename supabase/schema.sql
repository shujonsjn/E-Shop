-- E-Shop shared store
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.

create table if not exists public.store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Keep updated_at fresh on every write.
create or replace function public.touch_store_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists store_touch_updated_at on public.store;
create trigger store_touch_updated_at
before update on public.store
for each row execute function public.touch_store_updated_at();

-- Row level security
alter table public.store enable row level security;

-- The storefront is public, so anyone may read.
drop policy if exists "store_read" on public.store;
create policy "store_read" on public.store
  for select using (true);

-- Writes are open for this admin panel (it has no real auth yet).
-- If you later add Supabase Auth, replace these with authenticated checks.
drop policy if exists "store_insert" on public.store;
create policy "store_insert" on public.store
  for insert with check (true);

drop policy if exists "store_update" on public.store;
create policy "store_update" on public.store
  for update using (true) with check (true);

drop policy if exists "store_delete" on public.store;
create policy "store_delete" on public.store
  for delete using (true);

-- Realtime so every open browser/tab refreshes as soon as admin saves.
do $$
begin
  alter publication supabase_realtime add table public.store;
exception
  when duplicate_object then null;
end;
$$;
