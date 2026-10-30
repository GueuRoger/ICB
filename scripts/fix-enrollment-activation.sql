-- Align the existing enrollments table with the paid-payment trigger.
-- Live enrollments columns found: id, user_id, course_id, created_at, enrolled_at, expires_at, statu.
-- Live payments columns: id, user_id, total_amount, currency, payment_method, reference, status, created_at, updated_at.
-- Live payment_items columns: id, payment_id, course_id, quantity, unit_price.
-- This adds the missing enrollment columns and unique key. It does not update payments,
-- delete rows, or grant students permission to change payments.status.

begin;

alter table public.enrollments
  add column if not exists payment_id uuid;

alter table public.enrollments
  add column if not exists status text;

alter table public.enrollments
  add column if not exists updated_at timestamptz;

do $icb$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.enrollments'::regclass
      and conname = 'enrollments_payment_id_fkey'
  ) then
    alter table public.enrollments
      add constraint enrollments_payment_id_fkey
      foreign key (payment_id) references public.payments (id);
  end if;
end
$icb$;

do $icb$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.enrollments'::regclass
      and conname = 'enrollments_status_check'
  ) then
    alter table public.enrollments
      add constraint enrollments_status_check
      check (status is null or status in ('active', 'inactive'));
  end if;
end
$icb$;

do $icb$
begin
  if exists (
    select 1
    from pg_index as indexes
    join pg_class as tables on tables.oid = indexes.indrelid
    join pg_namespace as schemas on schemas.oid = tables.relnamespace
    where schemas.nspname = 'public'
      and tables.relname = 'enrollments'
      and indexes.indisunique
      and (
        select array_agg(attributes.attname::text order by attributes.attname)
        from unnest(indexes.indkey) as keys(attnum)
        join pg_attribute as attributes
          on attributes.attrelid = tables.oid
         and attributes.attnum = keys.attnum
        where keys.attnum > 0
      ) = array['course_id', 'user_id']
  ) then
    return;
  end if;

  if exists (
    select 1
    from public.enrollments
    where user_id is not null
      and course_id is not null
    group by user_id, course_id
    having count(*) > 1
  ) then
    raise exception 'Duplicate enrollments exist for the same user and course. No rows were changed.';
  end if;

  alter table public.enrollments
    add constraint enrollments_user_course_key unique (user_id, course_id);
end
$icb$;

create index if not exists enrollments_user_id_idx on public.enrollments (user_id);

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

drop trigger if exists payments_activate_enrollments on public.payments;
create trigger payments_activate_enrollments
after update of status on public.payments
for each row
execute procedure public.activate_enrollments_on_paid();

alter table public.enrollments enable row level security;

revoke all on function public.activate_enrollments_on_paid() from public, anon, authenticated;

commit;
