-- Program video libraries: Global Fluency + World Stage.
-- Run in the Supabase SQL editor.
--
-- Tables:
--   public.global_fluency_videos
--   public.world_stage_videos
--
-- Also seeds the existing Video-page Global Fluency entries into global_fluency_videos.
-- World Stage starts empty.

begin;

create table if not exists public.global_fluency_videos (
  id uuid primary key default gen_random_uuid(),
  position integer not null,
  title_en text not null,
  title_fr text not null,
  description_en text not null default '',
  description_fr text not null default '',
  duration text not null default '',
  youtube_id text default '',
  storage_path text,
  thumbnail_url text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint global_fluency_videos_position_check check (position > 0),
  constraint global_fluency_videos_source_check check (
    char_length(btrim(coalesce(youtube_id, ''))) > 0
    or char_length(btrim(coalesce(storage_path, ''))) > 0
  ),
  constraint global_fluency_videos_position_key unique (position)
);

create table if not exists public.world_stage_videos (
  id uuid primary key default gen_random_uuid(),
  position integer not null,
  title_en text not null,
  title_fr text not null,
  description_en text not null default '',
  description_fr text not null default '',
  duration text not null default '',
  youtube_id text default '',
  storage_path text,
  thumbnail_url text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint world_stage_videos_position_check check (position > 0),
  constraint world_stage_videos_source_check check (
    char_length(btrim(coalesce(youtube_id, ''))) > 0
    or char_length(btrim(coalesce(storage_path, ''))) > 0
  ),
  constraint world_stage_videos_position_key unique (position)
);

create index if not exists global_fluency_videos_published_position_idx
  on public.global_fluency_videos (is_published, position);

create index if not exists world_stage_videos_published_position_idx
  on public.world_stage_videos (is_published, position);

create or replace function public.set_program_video_updated_at()
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

drop trigger if exists global_fluency_videos_set_updated_at on public.global_fluency_videos;
create trigger global_fluency_videos_set_updated_at
before update on public.global_fluency_videos
for each row
execute function public.set_program_video_updated_at();

drop trigger if exists world_stage_videos_set_updated_at on public.world_stage_videos;
create trigger world_stage_videos_set_updated_at
before update on public.world_stage_videos
for each row
execute function public.set_program_video_updated_at();

-- Migrate the two existing Global Fluency Video-page entries (idempotent by position).
insert into public.global_fluency_videos (
  position,
  title_en,
  title_fr,
  description_en,
  description_fr,
  duration,
  youtube_id,
  thumbnail_url,
  is_published
)
select
  1,
  $icb$How to change your self-image$icb$,
  $icb$Comment changer votre image de soi$icb$,
  $icb$In this short video, Roger explains the mission behind world stage, who it is for, and what you can expect from it$icb$,
  $icb$Dans cette courte vidéo, Roger explique la mission de World Stage, à qui elle s'adresse et ce que vous pouvez en attendre.$icb$,
  $icb$2:18$icb$,
  $icb$M7lc1UVf-VE$icb$,
  $icb$/images/global-fluency-intro.png$icb$,
  true
where not exists (
  select 1 from public.global_fluency_videos where position = 1
);

insert into public.global_fluency_videos (
  position,
  title_en,
  title_fr,
  description_en,
  description_fr,
  duration,
  youtube_id,
  thumbnail_url,
  is_published
)
select
  2,
  $icb$How to win with speaking$icb$,
  $icb$Comment convaincre en prenant la parole$icb$,
  $icb$In this short video, Roger explains the mission behind world stage, who it is for, and what you can expect from it$icb$,
  $icb$Dans cette courte vidéo, Roger explique la mission de World Stage, à qui elle s'adresse et ce que vous pouvez en attendre.$icb$,
  $icb$2:18$icb$,
  $icb$jNQXAC9IVRw$icb$,
  $icb$/images/global-fluency-intro.png$icb$,
  true
where not exists (
  select 1 from public.global_fluency_videos where position = 2
);

-- Page copy for the two program video pages (site_content).
insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$global-fluency-videos$icb$, $icb$meta$icb$, $icb$title$icb$,
  $icb$Global Fluency Videos$icb$, $icb$Vidéos Global Fluency$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$global-fluency-videos$icb$ and content_key = $icb$title$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$global-fluency-videos$icb$, $icb$meta$icb$, $icb$document_description$icb$,
  $icb$Course videos for Global Fluency students.$icb$,
  $icb$Vidéos de cours pour les étudiants Global Fluency.$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$global-fluency-videos$icb$ and content_key = $icb$document_description$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$global-fluency-videos$icb$, $icb$player$icb$, $icb$play$icb$,
  $icb$Play$icb$, $icb$Lire$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$global-fluency-videos$icb$ and content_key = $icb$play$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage-videos$icb$, $icb$meta$icb$, $icb$title$icb$,
  $icb$World Stage Videos$icb$, $icb$Vidéos World Stage$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage-videos$icb$ and content_key = $icb$title$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage-videos$icb$, $icb$meta$icb$, $icb$document_description$icb$,
  $icb$Course videos for World Stage students.$icb$,
  $icb$Vidéos de cours pour les étudiants World Stage.$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage-videos$icb$ and content_key = $icb$document_description$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage-videos$icb$, $icb$player$icb$, $icb$play$icb$,
  $icb$Play$icb$, $icb$Lire$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage-videos$icb$ and content_key = $icb$play$icb$
);

alter table public.global_fluency_videos enable row level security;
alter table public.world_stage_videos enable row level security;

-- Access control for enrolled students + private Storage buckets:
-- run scripts/program-videos-storage.sql after this script.

-- Temporary published read until program-videos-storage.sql is applied.
revoke all on table public.global_fluency_videos from public, anon, authenticated;
revoke all on table public.world_stage_videos from public, anon, authenticated;

grant select on table public.global_fluency_videos to anon, authenticated;
grant select on table public.world_stage_videos to anon, authenticated;

drop policy if exists global_fluency_videos_public_read on public.global_fluency_videos;
create policy global_fluency_videos_public_read
on public.global_fluency_videos
for select
to anon, authenticated
using (is_published = true);

drop policy if exists world_stage_videos_public_read on public.world_stage_videos;
create policy world_stage_videos_public_read
on public.world_stage_videos
for select
to anon, authenticated
using (is_published = true);

-- No public insert/update/delete: manage videos in Table Editor (service role).

commit;
