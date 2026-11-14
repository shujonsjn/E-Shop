-- E-Shop shared store
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to run again: every object is created idempotently.

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

-- True only for Supabase Auth users whose app_metadata.role is "admin".
-- The admin account is created once in Authentication -> Users (or via the
-- Auth Admin API) with app_metadata: {"role":"admin"}.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- Row level security
alter table public.store enable row level security;

-- Storefront is public, so anyone may read.
drop policy if exists "store_read" on public.store;
create policy "store_read" on public.store
  for select using (true);

-- Remove the old wide-open write policies, if they are still around.
drop policy if exists "store_insert" on public.store;
drop policy if exists "store_update" on public.store;
drop policy if exists "store_delete" on public.store;

-- Only a signed-in admin may create/update/delete site content, catalog,
-- categories, brands and pages.
drop policy if exists "store_admin_write" on public.store;
create policy "store_admin_write" on public.store
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- Orders, customer accounts and reviews used to be rows of this table with
-- wide-open guest write policies. That let anyone holding the public anon key
-- rewrite every order and read plaintext passwords, so those policies are gone.
-- Run supabase/security-v2.sql to create the dedicated, RLS-protected
-- public.orders / public.reviews tables and the guest tracking RPCs.
drop policy if exists "store_public_insert" on public.store;
drop policy if exists "store_public_update" on public.store;

-- Realtime so every open browser/tab refreshes as soon as admin saves.
do $$
begin
  alter publication supabase_realtime add table public.store;
exception
  when duplicate_object then null;
end;
$$;
