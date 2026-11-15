-- E-Shop stock restore
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to run again (everything is idempotent).
--
-- What it does
-- ------------
-- Placing an order calls public.decrement_stock(), which lowers the product
-- stock. This migration adds the opposite direction: whenever an order becomes
-- "Cancelled", the quantities it contains are added back to the product stock.
--
-- Because it lives in a database trigger, it works for every cancellation
-- path without any client change:
--   * customer cancels from /track  -> public.cancel_order() updates the row
--   * customer cancels from /my/orders
--   * admin sets the status to Cancelled in Admin -> Orders
--   * admin deletes a not-yet-shipped order (its stock is returned too)
--
-- It also covers the reverse case: if an admin moves an order OUT of Cancelled
-- (for example back to Pending), the stock is taken away again so the numbers
-- never drift. Run this AFTER supabase/security-v2.sql.

-- ------------------------------------------------------------------ function --
create or replace function public.sync_stock_on_order_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_products jsonb;
  v_items    jsonb;
  v_item     jsonb;
  v_idx      int;
  v_stock    int;
  v_qty      int;
  v_new      int;
  v_delta    int;       -- +qty when cancelling, -qty when un-cancelling
  v_changed  boolean := false;
begin
  -- 1. Work out whether the order entered or left the Cancelled state.
  if tg_op = 'DELETE' then
    -- Deleting a real (not yet shipped) order gives its stock back.
    if coalesce(old.status, '') in ('Shipped', 'Out for Delivery', 'Delivered', 'Cancelled') then
      return old;
    end if;
    v_delta := 1;
    v_items := old.data -> 'items';
  else
    if new.status = 'Cancelled' and coalesce(old.status, '') <> 'Cancelled' then
      v_delta := 1;                                    -- cancelled: give back
    elsif coalesce(old.status, '') = 'Cancelled' and new.status <> 'Cancelled' then
      v_delta := -1;                                   -- re-opened: take again
    else
      return new;
    end if;
    v_items := new.data -> 'items';
  end if;

  if v_items is null or jsonb_typeof(v_items) <> 'array' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  select value into v_products from public.store where key = 'products';
  if v_products is null or jsonb_typeof(v_products) <> 'array' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  -- 2. Apply the quantity change to every matching product.
  for v_item in select * from jsonb_array_elements(v_items)
  loop
    select (t.ordinality - 1) into v_idx
    from jsonb_array_elements(v_products) with ordinality as t(elem, ordinality)
    where t.elem ->> 'id' = v_item ->> 'id'
    limit 1;

    if v_idx is null then
      continue;
    end if;

    -- Made-to-order products have no numeric stock: leave them untouched.
    if jsonb_typeof(v_products -> v_idx -> 'stock') is distinct from 'number' then
      v_idx := null;
      continue;
    end if;

    v_stock := coalesce((v_products -> v_idx ->> 'stock')::int, 0);
    v_qty   := greatest(coalesce((v_item ->> 'quantity')::int, 1), 1);
    v_new   := v_stock + (v_delta * v_qty);

    if v_delta < 0 then
      v_new := greatest(v_new, 0);              -- never go below zero
    end if;

    v_products := jsonb_set(v_products, array[v_idx::text, 'stock'], to_jsonb(v_new), false);
    v_changed := true;
    v_idx := null;
  end loop;

  if v_changed then
    update public.store
    set value = v_products, updated_at = now()
    where key = 'products';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

-- ----------------------------------------------------------------- triggers --
drop trigger if exists orders_sync_stock on public.orders;
create trigger orders_sync_stock
after update on public.orders
for each row execute function public.sync_stock_on_order_change();

drop trigger if exists orders_sync_stock_delete on public.orders;
create trigger orders_sync_stock_delete
after delete on public.orders
for each row execute function public.sync_stock_on_order_change();
