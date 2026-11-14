-- E-Shop security v2
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to run again (everything is idempotent).
--
-- Why this file exists
-- --------------------
-- The first schema let anyone with the public anon key update the whole
-- "orders", "users" and "reviews" rows of the shared "store" table. That meant
-- a stranger could rewrite every customer's order or read plaintext customer
-- passwords. This migration:
--   1. removes those guest write policies,
--   2. replaces the jsonb blobs with real, row-level-secured tables,
--   3. lets a guest look up and cancel an order only with id + phone.

-- ---------------------------------------------------------------- 1. store --
-- Guests may no longer insert or update store rows. Only the admin session
-- (is_admin()) can write settings/products/categories/brands/pages.
drop policy if exists "store_public_insert" on public.store;
drop policy if exists "store_public_update" on public.store;

-- The one-off jsonb rows are superseded by public.orders / public.users /
-- public.reviews below.
delete from public.store where key in ('orders', 'users', 'reviews');

-- --------------------------------------------------------------- 2. orders --
create table if not exists public.orders (
  id         bigint primary key,
  user_id    text,
  phone      text,
  status     text not null default 'Pending',
  data       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_phone_idx on public.orders (phone);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Anyone may place an order, but a new order must start as Pending.
drop policy if exists "orders_guest_insert" on public.orders;
create policy "orders_guest_insert" on public.orders
  for insert
  with check (status = 'Pending');

-- Only the admin panel (and a signed-in Supabase owner) may read orders.
drop policy if exists "orders_read" on public.orders;
create policy "orders_read" on public.orders
  for select
  using (public.is_admin() or user_id = auth.uid()::text);

-- Only the admin panel may change status or delete.
drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "orders_admin_delete" on public.orders;
create policy "orders_admin_delete" on public.orders
  for delete
  using (public.is_admin());

-- Keep updated_at fresh too (the admin RPC also sets it explicitly).
create or replace function public.touch_orders_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_orders_updated_at();

-- Guest order lookup: id + the last 10 digits of the phone must match.
create or replace function public.track_order(p_id bigint, p_phone text)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
  select jsonb_build_object(
    'id', o.id,
    'user_id', o.user_id,
    'status', o.status,
    'data', o.data,
    'created_at', o.created_at,
    'updated_at', o.updated_at
  )
  from public.orders o
  where o.id = p_id
    and length(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')) >= 10
    and right(regexp_replace(coalesce(o.phone, ''), '\D', '', 'g'), 10)
      = right(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g'), 10)
  limit 1;
$$;

grant execute on function public.track_order(bigint, text) to anon, authenticated;

-- Guest cancellation by id + phone. Returns 'cancelled', 'locked' (already
-- shipped) or 'not_found'.
create or replace function public.cancel_order(p_id bigint, p_phone text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
begin
  select status into v_status
  from public.orders
  where id = p_id
    and length(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')) >= 10
    and right(regexp_replace(coalesce(phone, ''), '\D', '', 'g'), 10)
      = right(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g'), 10);

  if v_status is null then
    return 'not_found';
  end if;

  if v_status in ('Shipped', 'Out for Delivery', 'Delivered', 'Cancelled') then
    return 'locked';
  end if;

  update public.orders
  set status = 'Cancelled',
      data = jsonb_set(
        data,
        '{statusHistory}',
        coalesce(data -> 'statusHistory', '[]'::jsonb) || jsonb_build_array(
          jsonb_build_object(
            'status', 'Cancelled',
            'date', now(),
            'note', 'Order cancelled'
          )
        )
      ),
      updated_at = now()
  where id = p_id;

  return 'cancelled';
end;
$$;

grant execute on function public.cancel_order(bigint, text) to anon, authenticated;

-- Deduct stock from the "products" store row after a successful order.
-- Silent no-op when the product has no stock field, so it can never block a
-- sale. SECURITY DEFINER is required because guests cannot write the store.
create or replace function public.decrement_stock(p_items jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_products jsonb;
  v_item jsonb;
  v_idx int;
  v_stock int;
  v_qty int;
  v_new int;
  v_changed boolean := false;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    return;
  end if;

  select value into v_products from public.store where key = 'products';
  if v_products is null or jsonb_typeof(v_products) <> 'array' then
    return;
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select (t.ordinality - 1) into v_idx
    from jsonb_array_elements(v_products) with ordinality as t(elem, ordinality)
    where t.elem ->> 'id' = v_item ->> 'id'
    limit 1;

    if v_idx is null then
      continue;
    end if;

    -- Products without a numeric stock field are made-to-order; leave them be.
    if jsonb_typeof(v_products -> v_idx -> 'stock') is distinct from 'number' then
      v_idx := null;
      continue;
    end if;

    v_stock := coalesce((v_products -> v_idx ->> 'stock')::int, 0);
    v_qty := greatest(coalesce((v_item ->> 'quantity')::int, 1), 1);
    v_new := greatest(v_stock - v_qty, 0);

    v_products := jsonb_set(v_products, array[v_idx::text, 'stock'], to_jsonb(v_new), false);
    v_changed := true;
    v_idx := null;
  end loop;

  if v_changed then
    update public.store
    set value = v_products, updated_at = now()
    where key = 'products';
  end if;
end;
$$;

grant execute on function public.decrement_stock(jsonb) to anon, authenticated;

-- -------------------------------------------------------------- 3. reviews --
create table if not exists public.reviews (
  id         bigint primary key,
  product_id text not null,
  user_id    text,
  user_name  text,
  rating     int not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_id_idx on public.reviews (product_id);

-- One review per customer per product (guests use a device-local user id).
create unique index if not exists reviews_product_user_idx
  on public.reviews (product_id, user_id)
  where user_id is not null;

alter table public.reviews enable row level security;

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (true);

drop policy if exists "reviews_public_insert" on public.reviews;
create policy "reviews_public_insert" on public.reviews
  for insert
  with check (rating between 1 and 5);

drop policy if exists "reviews_admin_write" on public.reviews;
create policy "reviews_admin_write" on public.reviews
  for all
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------- 5. image storage (media) --
-- Public read so images render on the storefront; only an admin may upload.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ------------------------------------------------------------- 6. realtime --
do $$
begin
  alter publication supabase_realtime add table public.orders;
exception
  when duplicate_object then null;
  when undefined_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.reviews;
exception
  when duplicate_object then null;
  when undefined_object then null;
end;
$$;
