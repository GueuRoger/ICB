-- Copy World Stage video course metadata into Global Fluency.
-- Run in the Supabase SQL editor (service role).
--
-- Source:      public.world_stage_videos  (read-only — never modified)
-- Destination: public.global_fluency_videos
--
-- Rules:
--   - Match / upsert by unique `position` (no duplicate positions).
--   - Keep existing Global Fluency row IDs on update; new rows get fresh UUIDs.
--   - Never reuse World Stage row IDs.
--   - Copy storage_path only when that object already exists in bucket
--     `global-fluency-videos`; otherwise leave storage_path null (YouTube fallback).
--   - Remove Global Fluency rows whose position is not present in World Stage
--     so the libraries match.

begin;

-- ── 1) Inspect current rows (run & review before relying on the write) ───────

select
  'world_stage_videos' as table_name,
  id,
  position,
  title_en,
  title_fr,
  left(description_en, 80) as description_en_preview,
  duration,
  youtube_id,
  storage_path,
  thumbnail_url,
  is_published
from public.world_stage_videos
order by position;

select
  'global_fluency_videos_before' as table_name,
  id,
  position,
  title_en,
  title_fr,
  left(description_en, 80) as description_en_preview,
  duration,
  youtube_id,
  storage_path,
  thumbnail_url,
  is_published
from public.global_fluency_videos
order by position;

-- Which World Stage storage_path values already exist in the GF bucket?
select
  ws.position,
  ws.storage_path as world_stage_storage_path,
  exists (
    select 1
    from storage.objects o
    where o.bucket_id = 'global-fluency-videos'
      and o.name = btrim(ws.storage_path)
  ) as exists_in_global_fluency_bucket
from public.world_stage_videos ws
where nullif(btrim(coalesce(ws.storage_path, '')), '') is not null
order by ws.position;

-- Extra Global Fluency positions that will be removed (not in World Stage)
select
  gf.id,
  gf.position,
  gf.title_en
from public.global_fluency_videos gf
where not exists (
  select 1
  from public.world_stage_videos ws
  where ws.position = gf.position
)
order by gf.position;

-- ── 2) Safety checks ─────────────────────────────────────────────────────────

do $icb$
declare
  ws_count integer;
  bad_source integer;
begin
  select count(*)::integer into ws_count from public.world_stage_videos;
  if ws_count < 1 then
    raise exception
      'Refusing copy: world_stage_videos is empty. No Global Fluency rows were changed.';
  end if;

  -- After copy, every destination row must still satisfy the source check
  -- (youtube_id and/or a GF-bucket storage_path). Fail early if a WS row
  -- would land with neither.
  select count(*)::integer
  into bad_source
  from public.world_stage_videos ws
  where char_length(btrim(coalesce(ws.youtube_id, ''))) = 0
    and (
      nullif(btrim(coalesce(ws.storage_path, '')), '') is null
      or not exists (
        select 1
        from storage.objects o
        where o.bucket_id = 'global-fluency-videos'
          and o.name = btrim(ws.storage_path)
      )
    );

  if bad_source > 0 then
    raise exception
      'Refusing copy: % World Stage row(s) have no youtube_id and no matching file in bucket global-fluency-videos. Fix those rows or upload the files first. No Global Fluency rows were changed.',
      bad_source;
  end if;
end;
$icb$;

-- ── 3) Upsert by position (update existing GF rows; insert missing positions)

with source as (
  select
    ws.position,
    ws.title_en,
    ws.title_fr,
    ws.description_en,
    ws.description_fr,
    ws.duration,
    coalesce(ws.youtube_id, '') as youtube_id,
    case
      when nullif(btrim(coalesce(ws.storage_path, '')), '') is not null
        and exists (
          select 1
          from storage.objects o
          where o.bucket_id = 'global-fluency-videos'
            and o.name = btrim(ws.storage_path)
        )
      then btrim(ws.storage_path)
      else null
    end as storage_path,
    coalesce(ws.thumbnail_url, '') as thumbnail_url,
    ws.is_published
  from public.world_stage_videos ws
),
updated as (
  update public.global_fluency_videos gf
  set
    title_en = s.title_en,
    title_fr = s.title_fr,
    description_en = s.description_en,
    description_fr = s.description_fr,
    duration = s.duration,
    youtube_id = s.youtube_id,
    storage_path = s.storage_path,
    thumbnail_url = s.thumbnail_url,
    is_published = s.is_published
    -- updated_at is set by trigger set_program_video_updated_at
  from source s
  where gf.position = s.position
  returning gf.id, gf.position, 'updated'::text as action
),
inserted as (
  insert into public.global_fluency_videos (
    -- id defaults to gen_random_uuid(); never copy World Stage ids
    position,
    title_en,
    title_fr,
    description_en,
    description_fr,
    duration,
    youtube_id,
    storage_path,
    thumbnail_url,
    is_published
  )
  select
    s.position,
    s.title_en,
    s.title_fr,
    s.description_en,
    s.description_fr,
    s.duration,
    s.youtube_id,
    s.storage_path,
    s.thumbnail_url,
    s.is_published
  from source s
  where not exists (
    select 1
    from public.global_fluency_videos gf
    where gf.position = s.position
  )
  returning id, position, 'inserted'::text as action
)
select * from updated
union all
select * from inserted
order by position, action;

-- ── 4) Drop Global Fluency-only positions so libraries match ─────────────────

delete from public.global_fluency_videos gf
where not exists (
  select 1
  from public.world_stage_videos ws
  where ws.position = gf.position
);

-- ── 5) Verify result ─────────────────────────────────────────────────────────

select
  'global_fluency_videos_after' as table_name,
  id,
  position,
  title_en,
  title_fr,
  left(description_en, 80) as description_en_preview,
  duration,
  youtube_id,
  storage_path,
  thumbnail_url,
  is_published
from public.global_fluency_videos
order by position;

-- Side-by-side check: counts + content parity (excluding id / timestamps)
select
  (select count(*) from public.world_stage_videos) as world_stage_count,
  (select count(*) from public.global_fluency_videos) as global_fluency_count,
  (
    select count(*)
    from public.world_stage_videos ws
    join public.global_fluency_videos gf on gf.position = ws.position
    where gf.title_en is not distinct from ws.title_en
      and gf.title_fr is not distinct from ws.title_fr
      and gf.description_en is not distinct from ws.description_en
      and gf.description_fr is not distinct from ws.description_fr
      and gf.duration is not distinct from ws.duration
      and coalesce(gf.youtube_id, '') is not distinct from coalesce(ws.youtube_id, '')
      and gf.thumbnail_url is not distinct from ws.thumbnail_url
      and gf.is_published is not distinct from ws.is_published
  ) as matching_metadata_rows;

-- storage_path decisions after copy
select
  gf.position,
  ws.storage_path as world_stage_storage_path,
  gf.storage_path as global_fluency_storage_path,
  case
    when nullif(btrim(coalesce(ws.storage_path, '')), '') is null then 'ws_had_none'
    when gf.storage_path is not null then 'copied_file_exists_in_gf_bucket'
    else 'left_null_youtube_fallback'
  end as storage_path_decision
from public.world_stage_videos ws
join public.global_fluency_videos gf on gf.position = ws.position
order by gf.position;

-- world_stage_videos must be unchanged; this is a read-only sanity count.
select count(*) as world_stage_videos_unchanged_count
from public.world_stage_videos;

commit;
