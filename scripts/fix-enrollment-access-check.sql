-- Alias of unify-enrollment-access.sql (same contents).
-- Run EITHER this file OR scripts/unify-enrollment-access.sql in the Supabase SQL editor.
-- Does NOT insert or modify enrollment rows.

begin;

create or replace function public.has_active_program_enrollment(program_slug text)
returns boolean
language sql
stable
security definer
set search_path = public
as $icb$
  select exists (
    select 1
    from public.enrollments
    join public.courses on courses.id = enrollments.course_id
    where enrollments.user_id = auth.uid()
      and (
        (
          lower(btrim(program_slug)) = 'world-stage'
          and (
            courses.id = '77536ce7-e0e5-4a9d-8960-33786caa3898'::uuid
            or lower(btrim(courses.slug)) in ('world-stage', 'world stage')
          )
        )
        or (
          lower(btrim(program_slug)) = 'global-fluency'
          and (
            courses.id = '0187d679-9042-4b87-83fb-3d5978f3f6ac'::uuid
            or lower(btrim(courses.slug)) = 'global-fluency'
          )
        )
        or lower(btrim(courses.slug)) = lower(btrim(program_slug))
      )
      and (
        lower(btrim(coalesce(enrollments.status, ''))) = 'active'
        or lower(btrim(coalesce(enrollments.statu, ''))) = 'active'
      )
      and (enrollments.expires_at is null or enrollments.expires_at > now())
  );
$icb$;

create or replace function public.list_my_active_programs()
returns table (program text)
language sql
stable
security definer
set search_path = public
as $icb$
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
  where enrollments.user_id = auth.uid()
    and normalized.program is not null
    and (
      lower(btrim(coalesce(enrollments.status, ''))) = 'active'
      or lower(btrim(coalesce(enrollments.statu, ''))) = 'active'
    )
    and (enrollments.expires_at is null or enrollments.expires_at > now());
$icb$;

revoke all on function public.has_active_program_enrollment(text) from public, anon, authenticated;
grant execute on function public.has_active_program_enrollment(text) to authenticated;

revoke all on function public.list_my_active_programs() from public, anon, authenticated;
grant execute on function public.list_my_active_programs() to authenticated;

commit;
