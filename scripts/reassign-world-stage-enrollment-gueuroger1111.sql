-- Reassign ONE World Stage enrollment to the current Auth user for gueuroger1111@gmail.com.
-- Run in the Supabase SQL editor.
--
-- Current Auth user:  819dee40-4272-49bf-88e5-db19ab506e26
-- Wrong enrollment user_id: 0cb3d37b-785d-43f2-a823-f85892801853
-- Enrollment id: 2e53ade4-02b5-41c7-adb7-4301582ac93a
-- World Stage course: 77536ce7-e0e5-4a9d-8960-33786caa3898
--
-- Does not create enrollments. Updates only this exact row.

begin;

-- Safety preview (should return exactly 1 row before update)
select
  id,
  user_id,
  course_id,
  status,
  statu,
  expires_at
from public.enrollments
where id = '2e53ade4-02b5-41c7-adb7-4301582ac93a'::uuid
  and user_id = '0cb3d37b-785d-43f2-a823-f85892801853'::uuid
  and course_id = '77536ce7-e0e5-4a9d-8960-33786caa3898'::uuid;

-- Fail loudly if the target row is missing or already changed
do $icb$
declare
  matched integer;
begin
  select count(*)::integer
  into matched
  from public.enrollments
  where id = '2e53ade4-02b5-41c7-adb7-4301582ac93a'::uuid
    and user_id = '0cb3d37b-785d-43f2-a823-f85892801853'::uuid
    and course_id = '77536ce7-e0e5-4a9d-8960-33786caa3898'::uuid;

  if matched <> 1 then
    raise exception
      'Refusing update: expected exactly 1 matching enrollment, found %. No rows were changed.',
      matched;
  end if;
end;
$icb$;

update public.enrollments
set user_id = '819dee40-4272-49bf-88e5-db19ab506e26'::uuid
where id = '2e53ade4-02b5-41c7-adb7-4301582ac93a'::uuid
  and user_id = '0cb3d37b-785d-43f2-a823-f85892801853'::uuid
  and course_id = '77536ce7-e0e5-4a9d-8960-33786caa3898'::uuid;

-- Confirm the single row now points at the current Auth user
select
  id,
  user_id,
  course_id,
  status,
  statu,
  expires_at,
  (user_id = '819dee40-4272-49bf-88e5-db19ab506e26'::uuid) as user_id_is_current_auth,
  (course_id = '77536ce7-e0e5-4a9d-8960-33786caa3898'::uuid) as course_id_is_world_stage
from public.enrollments
where id = '2e53ade4-02b5-41c7-adb7-4301582ac93a'::uuid;

-- Simulate list_my_active_programs() for this Auth user (SQL editor is not their browser session)
select distinct normalized.program
from public.enrollments
join public.courses on courses.id = enrollments.course_id
cross join lateral (
  select case
    when courses.id = '77536ce7-e0e5-4a9d-8960-33786caa3898'::uuid
      or lower(btrim(courses.slug)) in ('world-stage', 'world stage')
      then 'world-stage'
    when courses.id = '0187d679-9042-4b87-83fb-3d5978f3f6ac'::uuid
      or lower(btrim(courses.slug)) = 'global-fluency'
      then 'global-fluency'
    else null
  end as program
) as normalized
where enrollments.user_id = '819dee40-4272-49bf-88e5-db19ab506e26'::uuid
  and normalized.program is not null
  and (
    lower(btrim(coalesce(enrollments.status, ''))) = 'active'
    or lower(btrim(coalesce(enrollments.statu, ''))) = 'active'
  )
  and (enrollments.expires_at is null or enrollments.expires_at > now());

commit;
