-- Harden World Stage applications: authenticated account required for every insert.
-- Run in the Supabase SQL editor.
--
-- Fixes:
-- 1) Revoke anon insert (logged-out clients cannot create rows).
-- 2) BEFORE INSERT rejects missing auth and forces user_id + account email.
-- 3) RLS WITH CHECK requires user_id = auth.uid() (null no longer allowed).

begin;

-- Enforce non-null user_id. If this fails, inspect orphans first:
--   select id, email, created_at from public.world_stage_applications where user_id is null;
-- Then delete or reassign those rows and re-run this script.
alter table public.world_stage_applications
  alter column user_id set not null;

create or replace function public.world_stage_applications_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $icb$
declare
  account_email text;
begin
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
$icb$;

drop trigger if exists world_stage_applications_before_insert
  on public.world_stage_applications;
create trigger world_stage_applications_before_insert
before insert on public.world_stage_applications
for each row
execute function public.world_stage_applications_before_insert();

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

drop policy if exists world_stage_applications_select_own
  on public.world_stage_applications;
create policy world_stage_applications_select_own
on public.world_stage_applications
for select
to authenticated
using (user_id = auth.uid());

commit;
