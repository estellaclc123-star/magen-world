begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric(12, 2) not null check (price >= 0),
  original_price numeric(12, 2) check (original_price is null or original_price >= 0),
  description text not null default '',
  image_url text not null default '',
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_name text not null,
  email text not null,
  phone text not null,
  address text not null,
  payment_method text not null default 'cash_on_delivery' check (payment_method in ('cash_on_delivery', 'mobile_money')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal numeric(12, 2) not null,
  delivery_fee numeric(12, 2) not null,
  total numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  name text not null,
  price numeric(12, 2) not null,
  quantity integer not null check (quantity > 0),
  image_url text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on public.products (category);
create index if not exists idx_products_featured on public.products (featured) where featured;
create index if not exists idx_orders_user on public.orders (user_id, created_at desc);
create index if not exists idx_order_items_order on public.order_items (order_id);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

revoke all on table public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update (full_name) on public.profiles to authenticated;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created' and tgrelid = 'auth.users'::regclass) then
    execute $fn$
      create function public.handle_new_user()
      returns trigger
      language plpgsql
      security definer
      set search_path = ''
      as $body$
      begin
        insert into public.profiles (id, full_name, role)
        values (
          new.id,
          coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), ''),
          'customer'
        )
        on conflict (id) do nothing;
        return new;
      end;
      $body$;
    $fn$;
    execute $fn$
      create trigger on_auth_user_created
        after insert on auth.users
        for each row execute function public.handle_new_user();
    $fn$;
  end if;
end
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $body$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  )
$body$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create policy "products_public_read"
  on public.products
  for select
  to anon, authenticated
  using (true);

create policy "products_admin_insert"
  on public.products
  for insert
  to authenticated
  with check (public.is_admin());

create policy "products_admin_update"
  on public.products
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "products_admin_delete"
  on public.products
  for delete
  to authenticated
  using (public.is_admin());

create policy "profiles_select_own_or_admin"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());


create or replace function public.protect_profiles()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $body$
begin
  if old.id is distinct from new.id
    or old.created_at is distinct from new.created_at then
    raise exception 'profiles: only full_name can be changed'
      using errcode = 'insufficient_privilege';
  end if;

  if old.role is distinct from new.role and current_user <> 'postgres' then
    raise exception 'profiles: role can only be changed by a database owner'
      using errcode = 'insufficient_privilege';
  end if;

  if new.full_name is null or length(trim(new.full_name)) > 120 then
    raise exception 'profiles: invalid full_name'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$body$;

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_protect_profiles'
      and tgrelid = 'public.profiles'::regclass
  ) then
    execute $fn$
      create trigger trg_protect_profiles
        before update on public.profiles
        for each row execute function public.protect_profiles();
    $fn$;
  end if;
end
$$;

create policy "orders_select_own_or_admin"
  on public.orders
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "order_items_select_via_order"
  on public.order_items
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

create or replace function public.place_order(
  p_items jsonb,
  p_customer jsonb,
  p_payment_method text default 'cash_on_delivery'
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $body$
declare
  v_user uuid := auth.uid();
  v_name text;
  v_email text;
  v_phone text;
  v_address text;
  v_payment text;
  v_product public.products;
  v_qty integer;
  v_line numeric(12,2);
  v_subtotal numeric(12,2) := 0;
  v_delivery_fee numeric(12,2);
  v_order_id uuid;
  v_item jsonb;
  v_ids uuid[];
  v_sorted jsonb;
begin
  if v_user is null then
    raise exception 'place_order: authentication required'
      using errcode = 'insufficient_privilege';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0
    or jsonb_array_length(p_items) > 50 then
    raise exception 'place_order: items must be a non-empty array (max 50)'
      using errcode = 'invalid_parameter_value';
  end if;

  if p_customer is null or jsonb_typeof(p_customer) <> 'object' then
    raise exception 'place_order: customer object required'
      using errcode = 'invalid_parameter_value';
  end if;

  v_name := nullif(trim(coalesce(p_customer ->> 'name', '')), '');
  v_email := nullif(trim(coalesce(p_customer ->> 'email', '')), '');
  v_phone := nullif(trim(coalesce(p_customer ->> 'phone', '')), '');
  v_address := nullif(trim(coalesce(p_customer ->> 'address', '')), '');

  if v_name is null or char_length(v_name) > 120 then
    raise exception 'place_order: name required (max 120 chars)'
      using errcode = 'invalid_parameter_value';
  end if;

  if v_email is null or char_length(v_email) > 254
    or v_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' then
    raise exception 'place_order: valid email required'
      using errcode = 'invalid_parameter_value';
  end if;

  if v_phone is null or char_length(v_phone) > 20
    or v_phone !~ '^[+]?[0-9][0-9 ()-]{7,19}$' then
    raise exception 'place_order: valid phone required'
      using errcode = 'invalid_parameter_value';
  end if;

  if v_address is null or char_length(v_address) > 500 then
    raise exception 'place_order: address required (max 500 chars)'
      using errcode = 'invalid_parameter_value';
  end if;

v_payment := coalesce(p_payment_method, 'cash_on_delivery');

  if v_payment not in ('cash_on_delivery', 'mobile_money') then
    raise exception 'place_order: payment_method must be cash_on_delivery or mobile_money'
      using errcode = 'invalid_parameter_value';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    if jsonb_typeof(v_item -> 'product_id') <> 'string'
      or jsonb_typeof(v_item -> 'quantity') <> 'number' then
      raise exception 'place_order: each item needs product_id (string) and quantity (number)'
        using errcode = 'invalid_parameter_value';
    end if;
    begin
      v_ids := v_ids || (v_item ->> 'product_id')::uuid;
    exception
      when invalid_text_representation then
        raise exception 'place_order: invalid product_id'
          using errcode = 'invalid_parameter_value';
    end;
  end loop;

  if (select count(distinct x) from unnest(v_ids) x) <> array_length(v_ids, 1) then
    raise exception 'place_order: duplicate product_id in items'
      using errcode = 'invalid_parameter_value';
  end if;

  v_sorted := (
    select jsonb_agg(item order by (item ->> 'product_id'))
    from jsonb_array_elements(p_items) item
  );

for v_item in select jsonb_array_elements(v_sorted)
  loop
    v_qty := (v_item ->> 'quantity')::int;

    if v_qty is null or v_qty <= 0 or v_qty > 100
      or (v_item ->> 'quantity') !~ '^[0-9]+$' then
      raise exception 'place_order: quantity must be a whole number from 1 to 100'
        using errcode = 'invalid_parameter_value';
    end if;

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid
    for update;

    if not found or v_product.stock < v_qty then
      raise exception 'place_order: product unavailable or out of stock'
        using errcode = 'object_not_in_prerequisite_state';
    end if;

    update public.products
    set stock = stock - v_qty
    where id = v_product.id;

    v_line := round(v_product.price * v_qty, 2);
    v_subtotal := v_subtotal + v_line;
  end loop;

  if v_subtotal >= 1500 then
    v_delivery_fee := 0;
  else
    v_delivery_fee := 35;
  end if;

insert into public.orders (user_id, customer_name, email, phone, address, payment_method, status, subtotal, delivery_fee, total)
  values (v_user, v_name, v_email, v_phone, v_address, v_payment, 'pending', v_subtotal, v_delivery_fee, v_subtotal + v_delivery_fee)
  returning id into v_order_id;

  for v_item in select jsonb_array_elements(v_sorted)
  loop
    insert into public.order_items (order_id, product_id, name, price, quantity, image_url)
    select v_order_id, p.id, p.name, p.price, (v_item ->> 'quantity')::int, p.image_url
    from public.products p
    where p.id = (v_item ->> 'product_id')::uuid;
  end loop;

  return v_order_id;
end;
$body$;

revoke all on function public.place_order(jsonb, jsonb, text) from public, anon;
grant execute on function public.place_order(jsonb, jsonb, text) to authenticated;

create or replace function public.update_order_status(
  p_order_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = ''
as $body$
declare
  v_current text;
  v_user uuid := auth.uid();
  v_item record;
begin
  if v_user is null or not public.is_admin() then
    raise exception 'update_order_status: admin only'
      using errcode = 'insufficient_privilege';
  end if;

if p_status is null or p_status not in ('pending', 'processing', 'shipped', 'delivered', 'cancelled') then
    raise exception 'update_order_status: invalid status'
      using errcode = 'invalid_parameter_value';
  end if;

  select status into v_current
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'update_order_status: order not found'
      using errcode = 'no_data_found';
  end if;

  if v_current = p_status then
    return;
  end if;

  if v_current = 'cancelled' then
    raise exception 'update_order_status: cannot leave cancelled'
      using errcode = 'object_not_in_prerequisite_state';
  end if;

  if v_current = 'delivered' then
    raise exception 'update_order_status: cannot leave delivered'
      using errcode = 'object_not_in_prerequisite_state';
  end if;

  if not (
    (v_current = 'pending' and p_status in ('processing', 'cancelled'))
    or (v_current = 'processing' and p_status in ('shipped', 'cancelled'))
    or (v_current = 'shipped' and p_status in ('delivered', 'cancelled'))
  ) then
    raise exception 'update_order_status: invalid transition % -> %', v_current, p_status
      using errcode = 'invalid_parameter_value';
  end if;

if p_status = 'cancelled' then
    for v_item in
      select product_id, quantity
      from public.order_items
      where order_id = p_order_id
        and product_id is not null
      order by product_id
    loop
      update public.products
      set stock = stock + v_item.quantity
      where id = v_item.product_id;
    end loop;
  end if;

  update public.orders
  set status = p_status
  where id = p_order_id;
end;
$body$;

revoke all on function public.update_order_status(uuid, text) from public, anon;
grant execute on function public.update_order_status(uuid, text) to authenticated;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'product-images');

create policy "product_images_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

commit;
