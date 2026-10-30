-- READ-ONLY diagnosis for gueuroger1111@gmail.com World Stage access.
-- Run in Supabase SQL editor. Does not insert/update/delete enrollment rows.

-- 1) Auth user(s) for this email (duplicate accounts would show multiple rows)
select
  users.id as auth_user_id,
  users.email,
  users.created_at,
  users.last_sign_in_at,
  users.email_confirmed_at
from auth.users as users
where lower(users.email) = lower('gueuroger1111@gmail.com')
order by users.created_at;

-- 2) World Stage course row
select
  courses.id,
  courses.slug,
  courses.status,
  courses.name_en
from public.courses
where courses.id = '77536ce7-e0e5-4a9d-8960-33786caa3898'
   or lower(btrim(courses.slug)) in ('world-stage', 'world stage');

-- 3) All enrollments for this email's auth user id(s), with course join
select
  users.id as auth_user_id,
  users.email,
  enrollments.id as enrollment_id,
  enrollments.user_id,
  enrollments.user_id = users.id as user_id_matches_auth,
  enrollments.course_id,
  enrollments.course_id = '77536ce7-e0e5-4a9d-8960-33786caa3898'::uuid as course_id_is_expected_ws,
  enrollments.status,
  enrollments.statu,
  enrollments.expires_at,
  courses.id as joined_course_id,
  courses.slug as joined_course_slug,
  lower(btrim(coalesce(enrollments.status, ''))) = 'active' as status_is_active,
  lower(btrim(coalesce(enrollments.statu, ''))) = 'active' as statu_is_active,
  (
    lower(btrim(coalesce(enrollments.status, ''))) = 'active'
    or lower(btrim(coalesce(enrollments.statu, ''))) = 'active'
  ) as either_status_active,
  (enrollments.expires_at is null or enrollments.expires_at > now()) as not_expired,
  public.has_active_program_enrollment('world-stage') as helper_as_current_session
from auth.users as users
left join public.enrollments
  on enrollments.user_id = users.id
left join public.courses
  on courses.id = enrollments.course_id
where lower(users.email) = lower('gueuroger1111@gmail.com')
order by users.created_at, enrollments.created_at nulls last;

-- 4) Simulate helper logic for EACH auth user id (not the current SQL-editor session)
select
  users.id as auth_user_id,
  users.email,
  exists (
    select 1
    from public.enrollments
    join public.courses on courses.id = enrollments.course_id
    where enrollments.user_id = users.id
      and (
        courses.id = '77536ce7-e0e5-4a9d-8960-33786caa3898'::uuid
        or lower(btrim(courses.slug)) in ('world-stage', 'world stage')
      )
      and (
        lower(btrim(coalesce(enrollments.status, ''))) = 'active'
        or lower(btrim(coalesce(enrollments.statu, ''))) = 'active'
      )
      and (enrollments.expires_at is null or enrollments.expires_at > now())
  ) as would_pass_world_stage_access
from auth.users as users
where lower(users.email) = lower('gueuroger1111@gmail.com');
