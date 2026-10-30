begin;

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_email text,
  total_amount numeric(12, 2) not null default 0,
  currency text not null default 'USD',
  payment_method text not null,
  reference text not null unique,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_method_check check (payment_method in ('wave', 'card')),
  constraint payments_status_check check (status in ('pending', 'paid', 'failed', 'cancelled')),
  constraint payments_amount_check check (total_amount >= 0)
);

create table if not exists public.payment_items (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments (id) on delete cascade,
  course_id uuid not null references public.courses (id),
  quantity integer not null,
  unit_price numeric(12, 2) not null,
  constraint payment_items_quantity_check check (quantity > 0 and quantity <= 99),
  constraint payment_items_price_check check (unit_price >= 0),
  constraint payment_items_course_key unique (payment_id, course_id)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id),
  payment_id uuid references public.payments (id),
  status text,
  statu text,
  created_at timestamptz not null default now(),
  enrolled_at timestamptz,
  expires_at timestamptz,
  updated_at timestamptz,
  constraint enrollments_status_check check (status is null or status in ('active', 'inactive')),
  constraint enrollments_user_course_key unique (user_id, course_id)
);

create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists payment_items_payment_id_idx on public.payment_items (payment_id);
create index if not exists enrollments_user_id_idx on public.enrollments (user_id);

create or replace function public.generate_payment_reference()
returns text
language plpgsql
security definer
set search_path = public
as $icb$
declare
  candidate text;
begin
  loop
    candidate := 'ICB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
    exit when not exists (select 1 from public.payments where reference = candidate);
  end loop;
  return candidate;
end;
$icb$;

create or replace function public.protect_payment_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $icb$
declare
  account_email text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required to create a payment.';
  end if;

  select users.email
  into account_email
  from auth.users as users
  where users.id = auth.uid();

  if account_email is null or btrim(account_email) = '' then
    raise exception 'Authenticated account email is required to create a payment.';
  end if;

  if new.payment_method not in ('wave', 'card') then
    raise exception 'Invalid payment method';
  end if;
  new.user_id := auth.uid();
  new.customer_email := lower(btrim(account_email));
  new.status := 'pending';
  new.reference := public.generate_payment_reference();
  new.total_amount := 0;
  if new.currency is null or btrim(new.currency) = '' then
    new.currency := 'USD';
  end if;
  new.updated_at := now();
  return new;
end;
$icb$;

create or replace function public.protect_payment_item_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $icb$
declare
  owner uuid;
  payment_status text;
  course_price numeric;
begin
  select payments.user_id, payments.status
  into owner, payment_status
  from public.payments
  where payments.id = new.payment_id;

  if owner is null or owner <> auth.uid() or payment_status <> 'pending' then
    raise exception 'Payment cannot be changed';
  end if;

  if new.quantity is null or new.quantity < 1 or new.quantity > 99 then
    raise exception 'Invalid quantity';
  end if;

  select courses.price
  into course_price
  from public.courses
  where courses.id = new.course_id
    and (
      courses.status is null
      or btrim(courses.status) = ''
      or lower(btrim(courses.status)) in ('published', 'public', 'active')
    );

  if course_price is null then
    raise exception 'Unknown course';
  end if;

  new.unit_price := course_price;
  return new;
end;
$icb$;

create or replace function public.recalculate_payment_total()
returns trigger
language plpgsql
security definer
set search_path = public
as $icb$
declare
  target uuid;
begin
  target := coalesce(new.payment_id, old.payment_id);
  update public.payments
  set total_amount = coalesce((
        select sum(payment_items.unit_price * payment_items.quantity)
        from public.payment_items
        where payment_items.payment_id = target
      ), 0),
      updated_at = now()
  where payments.id = target
    and payments.status = 'pending';
  return null;
end;
$icb$;

create or replace function public.activate_enrollments_on_paid()
returns trigger
language plpgsql
security definer
set search_path = public
as $icb$
begin
  if new.status is distinct from 'paid' or old.status is not distinct from 'paid' then
    return new;
  end if;

  if new.user_id is null then
    raise exception
      'Cannot activate enrollment: payment % has no user_id. The customer must be logged in when paying.',
      new.id;
  end if;

  insert into public.enrollments (
    user_id,
    course_id,
    payment_id,
    status,
    statu,
    updated_at,
    enrolled_at
  )
  select distinct
    new.user_id,
    payment_items.course_id,
    new.id,
    'active',
    'active',
    now(),
    now()
  from public.payment_items
  where payment_items.payment_id = new.id
    and payment_items.course_id is not null
  on conflict (user_id, course_id) do update
    set status = 'active',
        statu = 'active',
        payment_id = excluded.payment_id,
        updated_at = now(),
        enrolled_at = coalesce(public.enrollments.enrolled_at, excluded.enrolled_at);

  return new;
end;
$icb$;

create or replace function public.create_pending_payment(method text, items jsonb)
returns table (payment_id uuid, payment_reference text, amount numeric, payment_currency text)
language plpgsql
security definer
set search_path = public
as $icb$
declare
  new_id uuid;
  chosen_currency text;
  account_email text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required to create a payment.';
  end if;

  select users.email
  into account_email
  from auth.users as users
  where users.id = auth.uid();

  if account_email is null or btrim(account_email) = '' then
    raise exception 'Authenticated account email is required to create a payment.';
  end if;

  if method not in ('wave', 'card') then
    raise exception 'Invalid payment method';
  end if;
  if jsonb_typeof(items) <> 'array' or jsonb_array_length(items) < 1 or jsonb_array_length(items) > 20 then
    raise exception 'Invalid courses';
  end if;

  if exists (
    select 1
    from (
      select btrim(entry.slug) as slug, sum(entry.quantity)::integer as quantity
      from jsonb_to_recordset(items) as entry(slug text, quantity integer)
      where btrim(coalesce(entry.slug, '')) <> ''
      group by btrim(entry.slug)
    ) as requested
    where requested.quantity is null
      or requested.quantity < 1
      or requested.quantity > 99
      or not exists (
        select 1
        from public.courses
        where courses.slug = requested.slug
          and (
            courses.status is null
            or btrim(courses.status) = ''
            or lower(btrim(courses.status)) in ('published', 'public', 'active')
          )
      )
  ) then
    raise exception 'Invalid courses';
  end if;

  select courses.currency
  into chosen_currency
  from jsonb_to_recordset(items) as entry(slug text, quantity integer)
  join public.courses on courses.slug = btrim(entry.slug)
  limit 1;

  insert into public.payments (
    user_id,
    customer_email,
    total_amount,
    currency,
    payment_method,
    status
  )
  values (
    auth.uid(),
    lower(btrim(account_email)),
    0,
    coalesce(nullif(btrim(chosen_currency), ''), 'USD'),
    method,
    'pending'
  )
  returning payments.id into new_id;

  insert into public.payment_items (payment_id, course_id, quantity, unit_price)
  select new_id, courses.id, requested.quantity, courses.price
  from (
    select btrim(entry.slug) as slug, sum(entry.quantity)::integer as quantity
    from jsonb_to_recordset(items) as entry(slug text, quantity integer)
    where btrim(coalesce(entry.slug, '')) <> ''
    group by btrim(entry.slug)
  ) as requested
  join public.courses on courses.slug = requested.slug;

  if not exists (select 1 from public.payment_items where payment_items.payment_id = new_id) then
    raise exception 'Invalid courses';
  end if;

  return query
  select payments.id, payments.reference, payments.total_amount, payments.currency
  from public.payments
  where payments.id = new_id;
end;
$icb$;

drop trigger if exists payments_protect_insert on public.payments;
create trigger payments_protect_insert
before insert on public.payments
for each row
execute procedure public.protect_payment_insert();

drop trigger if exists payment_items_protect_insert on public.payment_items;
create trigger payment_items_protect_insert
before insert on public.payment_items
for each row
execute procedure public.protect_payment_item_insert();

drop trigger if exists payment_items_recalculate_total on public.payment_items;
create trigger payment_items_recalculate_total
after insert on public.payment_items
for each row
execute procedure public.recalculate_payment_total();

drop trigger if exists payments_activate_enrollments on public.payments;
create trigger payments_activate_enrollments
after update of status on public.payments
for each row
execute procedure public.activate_enrollments_on_paid();

alter table public.payments enable row level security;
alter table public.payment_items enable row level security;
alter table public.enrollments enable row level security;

revoke all on table public.payments from public, anon, authenticated;
revoke all on table public.payment_items from public, anon, authenticated;
revoke all on table public.enrollments from public, anon, authenticated;

grant select, insert on table public.payments to authenticated;
grant select, insert on table public.payment_items to authenticated;
grant select on table public.enrollments to authenticated;

drop policy if exists payments_select_own on public.payments;
create policy payments_select_own
on public.payments
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists payments_insert_own on public.payments;
create policy payments_insert_own
on public.payments
for insert
to authenticated
with check (user_id = auth.uid() and status = 'pending');

drop policy if exists payment_items_select_own on public.payment_items;
create policy payment_items_select_own
on public.payment_items
for select
to authenticated
using (
  exists (
    select 1
    from public.payments
    where payments.id = payment_items.payment_id
      and payments.user_id = auth.uid()
  )
);

drop policy if exists payment_items_insert_own on public.payment_items;
create policy payment_items_insert_own
on public.payment_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.payments
    where payments.id = payment_items.payment_id
      and payments.user_id = auth.uid()
      and payments.status = 'pending'
  )
);

drop policy if exists enrollments_select_own on public.enrollments;
create policy enrollments_select_own
on public.enrollments
for select
to authenticated
using (user_id = auth.uid());

revoke all on function public.generate_payment_reference() from public, anon, authenticated;
revoke all on function public.protect_payment_insert() from public, anon, authenticated;
revoke all on function public.protect_payment_item_insert() from public, anon, authenticated;
revoke all on function public.recalculate_payment_total() from public, anon, authenticated;
revoke all on function public.activate_enrollments_on_paid() from public, anon, authenticated;
revoke all on function public.create_pending_payment(text, jsonb) from public, anon, authenticated;
grant execute on function public.create_pending_payment(text, jsonb) to authenticated;

commit;
