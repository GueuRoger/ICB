-- World Stage applications: public can submit; cannot read/modify others' rows.
-- Run in the Supabase SQL editor (publishable key cannot CREATE TABLE / policies).

begin;

create table if not exists public.world_stage_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete restrict,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  company text not null,
  job_title text not null,
  industry text not null,
  industry_other text,
  previous_assignments text not null,
  phone_consent boolean not null,
  terms_consent boolean not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint world_stage_applications_status_check
    check (status in ('pending', 'reviewed', 'accepted', 'rejected', 'withdrawn')),
  constraint world_stage_applications_email_check
    check (char_length(trim(email)) > 3 and position('@' in email) > 1),
  constraint world_stage_applications_consents_check
    check (phone_consent = true and terms_consent = true)
);

create index if not exists world_stage_applications_created_at_idx
  on public.world_stage_applications (created_at desc);

create index if not exists world_stage_applications_email_idx
  on public.world_stage_applications (email);

create index if not exists world_stage_applications_user_id_idx
  on public.world_stage_applications (user_id);

create index if not exists world_stage_applications_status_idx
  on public.world_stage_applications (status);

create or replace function public.world_stage_applications_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  account_email text;
begin
  -- Authenticated account is mandatory for every application row.
  if auth.uid() is null then
    raise exception 'Authentication required to submit a World Stage application.';
  end if;

  select users.email
  into account_email
  from auth.users as users
  where users.id = auth.uid();

  if account_email is null or btrim(account_email) = '' then
    raise exception 'Authenticated account email is required to submit a World Stage application.';
  end if;

  new.user_id := auth.uid();
  new.email := lower(btrim(account_email));
  new.status := 'pending';
  new.created_at := coalesce(new.created_at, now());
  new.updated_at := now();
  new.first_name := trim(new.first_name);
  new.last_name := trim(new.last_name);
  new.phone := trim(new.phone);
  new.company := trim(new.company);
  new.job_title := trim(new.job_title);
  new.industry := trim(new.industry);
  new.industry_other := nullif(trim(coalesce(new.industry_other, '')), '');
  new.previous_assignments := trim(new.previous_assignments);
  return new;
end;
$$;

drop trigger if exists world_stage_applications_before_insert
  on public.world_stage_applications;
create trigger world_stage_applications_before_insert
before insert on public.world_stage_applications
for each row
execute function public.world_stage_applications_before_insert();

create or replace function public.world_stage_applications_set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists world_stage_applications_set_updated_at
  on public.world_stage_applications;
create trigger world_stage_applications_set_updated_at
before update on public.world_stage_applications
for each row
execute function public.world_stage_applications_set_updated_at();

alter table public.world_stage_applications enable row level security;

revoke all on table public.world_stage_applications from public, anon, authenticated;
grant insert on table public.world_stage_applications to authenticated;
grant select on table public.world_stage_applications to authenticated;

drop policy if exists world_stage_applications_insert_public
  on public.world_stage_applications;
drop policy if exists world_stage_applications_insert_authenticated
  on public.world_stage_applications;
create policy world_stage_applications_insert_authenticated
on public.world_stage_applications
for insert
to authenticated
with check (
  status = 'pending'
  and user_id = auth.uid()
  and phone_consent = true
  and terms_consent = true
);

-- Logged-in applicants may read only their own rows. Anon cannot read any rows.
drop policy if exists world_stage_applications_select_own
  on public.world_stage_applications;
create policy world_stage_applications_select_own
on public.world_stage_applications
for select
to authenticated
using (user_id = auth.uid());

-- No public update/delete: applicants cannot modify applications (including others').

commit;
