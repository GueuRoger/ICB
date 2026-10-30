-- Program course videos in private Supabase Storage (Global Fluency + World Stage).
-- Run in the Supabase SQL editor after program-videos.sql (and enrollment tables) exist.
--
-- Adds:
--   storage_path on both video tables (YouTube remains supported)
--   private buckets: global-fluency-videos, world-stage-videos
--   enrolled-only SELECT for video metadata + storage objects
--
-- Admin uploads: Storage → bucket → Upload, then set storage_path on the video row
-- (Dashboard / service role bypasses storage RLS).

begin;

-- ── Columns & source constraints ─────────────────────────────────────────────

alter table public.global_fluency_videos
  add column if not exists storage_path text;

alter table public.world_stage_videos
  add column if not exists storage_path text;

-- Allow YouTube-only, Storage-only, or both during the transition.
alter table public.global_fluency_videos
  alter column youtube_id drop not null;

alter table public.world_stage_videos
  alter column youtube_id drop not null;

alter table public.global_fluency_videos
  alter column youtube_id set default '';

alter table public.world_stage_videos
  alter column youtube_id set default '';

alter table public.global_fluency_videos
  drop constraint if exists global_fluency_videos_youtube_id_check;

alter table public.world_stage_videos
  drop constraint if exists world_stage_videos_youtube_id_check;

alter table public.global_fluency_videos
  drop constraint if exists global_fluency_videos_source_check;

alter table public.world_stage_videos
  drop constraint if exists world_stage_videos_source_check;

alter table public.global_fluency_videos
  add constraint global_fluency_videos_source_check
  check (
    char_length(btrim(coalesce(youtube_id, ''))) > 0
    or char_length(btrim(coalesce(storage_path, ''))) > 0
  );

alter table public.world_stage_videos
  add constraint world_stage_videos_source_check
  check (
    char_length(btrim(coalesce(youtube_id, ''))) > 0
    or char_length(btrim(coalesce(storage_path, ''))) > 0
  );

-- ── Enrollment helper (used by table + storage RLS) ──────────────────────────

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
      -- Treat modern `status` OR legacy `statu` as authoritative.
      -- Do not let a null/blank `status` hide an active `statu` value.
      and (
        lower(btrim(coalesce(enrollments.status, ''))) = 'active'
        or lower(btrim(coalesce(enrollments.statu, ''))) = 'active'
      )
      and (enrollments.expires_at is null or enrollments.expires_at > now())
  );
$icb$;

revoke all on function public.has_active_program_enrollment(text) from public, anon, authenticated;
grant execute on function public.has_active_program_enrollment(text) to authenticated;

-- ── Video metadata: enrolled students only (published rows) ──────────────────

revoke all on table public.global_fluency_videos from public, anon, authenticated;
revoke all on table public.world_stage_videos from public, anon, authenticated;
grant select on table public.global_fluency_videos to authenticated;
grant select on table public.world_stage_videos to authenticated;

drop policy if exists global_fluency_videos_public_read on public.global_fluency_videos;
drop policy if exists global_fluency_videos_enrolled_read on public.global_fluency_videos;
create policy global_fluency_videos_enrolled_read
on public.global_fluency_videos
for select
to authenticated
using (
  is_published = true
  and public.has_active_program_enrollment('global-fluency')
);

drop policy if exists world_stage_videos_public_read on public.world_stage_videos;
drop policy if exists world_stage_videos_enrolled_read on public.world_stage_videos;
create policy world_stage_videos_enrolled_read
on public.world_stage_videos
for select
to authenticated
using (
  is_published = true
  and public.has_active_program_enrollment('world-stage')
);

-- ── Private storage buckets ──────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'global-fluency-videos',
  'global-fluency-videos',
  false,
  524288000,
  array['video/mp4', 'video/webm', 'video/quicktime']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'world-stage-videos',
  'world-stage-videos',
  false,
  524288000,
  array['video/mp4', 'video/webm', 'video/quicktime']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists global_fluency_videos_storage_select on storage.objects;
create policy global_fluency_videos_storage_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'global-fluency-videos'
  and public.has_active_program_enrollment('global-fluency')
);

drop policy if exists world_stage_videos_storage_select on storage.objects;
create policy world_stage_videos_storage_select
on storage.objects
for select
to authenticated
using (
  bucket_id = 'world-stage-videos'
  and public.has_active_program_enrollment('world-stage')
);

-- No student insert/update/delete on storage objects — upload via Dashboard (service role).

commit;
