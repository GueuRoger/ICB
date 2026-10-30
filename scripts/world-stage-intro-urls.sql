-- Point World Stage intro thumbnail + video CMS keys at Storage public URLs.
-- Run AFTER the world-stage bucket exists and files are uploaded:
--   intro-thumbnail.png
--   intro-video.mp4
-- Publishable key cannot UPDATE/INSERT site_content — use the SQL editor.
--
-- Keys (page = world-stage, section = hero):
--   intro_image  (thumbnail URL)
--   intro_video  (video URL)
--   intro_play   (play button aria-label)

begin;

insert into public.site_content (page, section, content_key, value_en, value_fr)
select
  $icb$world-stage$icb$,
  $icb$hero$icb$,
  $icb$intro_image$icb$,
  $icb$https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-thumbnail.png$icb$,
  $icb$https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-thumbnail.png$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$intro_image$icb$
);

update public.site_content
set
  value_en = $icb$https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-thumbnail.png$icb$,
  value_fr = $icb$https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-thumbnail.png$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$intro_image$icb$;

insert into public.site_content (page, section, content_key, value_en, value_fr)
select
  $icb$world-stage$icb$,
  $icb$hero$icb$,
  $icb$intro_video$icb$,
  $icb$https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-video.mp4$icb$,
  $icb$https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-video.mp4$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$intro_video$icb$
);

update public.site_content
set
  value_en = $icb$https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-video.mp4$icb$,
  value_fr = $icb$https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-video.mp4$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$intro_video$icb$;

insert into public.site_content (page, section, content_key, value_en, value_fr)
select
  $icb$world-stage$icb$,
  $icb$hero$icb$,
  $icb$intro_play$icb$,
  $icb$Play program introduction$icb$,
  $icb$Lire la présentation du programme$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$intro_play$icb$
);

update public.site_content
set
  value_en = $icb$Play program introduction$icb$,
  value_fr = $icb$Lire la présentation du programme$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$intro_play$icb$;

commit;
