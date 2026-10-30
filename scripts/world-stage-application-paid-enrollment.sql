-- When a World Stage application is marked paid, auto-activate World Stage enrollment.
-- Run in the Supabase SQL editor after world_stage_applications exists.
--
-- Manual workflow:
--   Table Editor → world_stage_applications → set status = paid → Save
--   → enrollments row for that user_id + World Stage course is created/activated.
--
-- Status values that grant access: paid, accepted_paid
-- Status values that do NOT grant access: pending, reviewed, accepted, rejected, withdrawn

begin;

-- Allow paid statuses on applications.
alter table public.world_stage_applications
  drop constraint if exists world_stage_applications_status_check;

alter table public.world_stage_applications
  add constraint world_stage_applications_status_check
  check (
    status in (
      'pending',
      'reviewed',
      'accepted',
      'rejected',
      'withdrawn',
      'paid',
      'accepted_paid'
    )
  );

create or replace function public.activate_world_stage_enrollment_on_application_paid()
returns trigger
language plpgsql
security definer
set search_path = public
as $icb$
declare
  target_course_id uuid;
begin
  -- Only paid / accepted_paid unlocks the course.
  if new.status is distinct from 'paid'
     and new.status is distinct from 'accepted_paid' then
    return new;
  end if;

  -- Idempotent: re-saving paid is safe and re-asserts active access.
  if new.user_id is null then
    raise exception
      'Cannot activate World Stage enrollment: application % has no user_id. The applicant must be logged in when applying.',
      new.id;
  end if;

  select courses.id
  into target_course_id
  from public.courses
  where courses.slug = 'world-stage'
  limit 1;

  if target_course_id is null then
    select courses.id
    into target_course_id
    from public.courses
    where lower(btrim(courses.slug)) = 'world stage'
    limit 1;
  end if;

  if target_course_id is null then
    raise exception 'Cannot activate World Stage enrollment: course slug world-stage was not found.';
  end if;

  insert into public.enrollments (
    user_id,
    course_id,
    payment_id,
    status,
    statu,
    enrolled_at,
    updated_at
  )
  values (
    new.user_id,
    target_course_id,
    null,
    'active',
    'active',
    now(),
    now()
  )
  on conflict (user_id, course_id) do update
  set
    status = 'active',
    statu = 'active',
    updated_at = now(),
    enrolled_at = coalesce(public.enrollments.enrolled_at, excluded.enrolled_at),
    expires_at = null;

  return new;
end;
$icb$;

drop trigger if exists world_stage_applications_activate_enrollment_on_paid
  on public.world_stage_applications;

create trigger world_stage_applications_activate_enrollment_on_paid
after update of status on public.world_stage_applications
for each row
execute function public.activate_world_stage_enrollment_on_application_paid();

revoke all on function public.activate_world_stage_enrollment_on_application_paid()
  from public, anon, authenticated;

commit;
