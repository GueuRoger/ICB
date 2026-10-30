-- Point Global Fluency intro thumbnail + video CMS keys at Storage public URLs.
-- Run AFTER the global-fluency bucket exists and files are uploaded:
--   intro-thumbnail.png
--   intro-video.mp4
-- Publishable key cannot UPDATE/INSERT site_content — use the SQL editor.

begin;

update public.site_content
set
  value_en = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/global-fluency/intro-thumbnail.png',
  value_fr = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/global-fluency/intro-thumbnail.png'
where page = 'global-fluency' and content_key = 'intro_image';

insert into public.site_content (page, section, content_key, value_en, value_fr)
select
  'global-fluency',
  'hero',
  'intro_video',
  'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/global-fluency/intro-video.mp4',
  'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/global-fluency/intro-video.mp4'
where not exists (
  select 1 from public.site_content
  where page = 'global-fluency' and content_key = 'intro_video'
);

update public.site_content
set
  value_en = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/global-fluency/intro-video.mp4',
  value_fr = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/global-fluency/intro-video.mp4'
where page = 'global-fluency' and content_key = 'intro_video';

insert into public.site_content (page, section, content_key, value_en, value_fr)
select
  'global-fluency',
  'hero',
  'intro_play',
  'Play program introduction',
  'Lire la présentation du programme'
where not exists (
  select 1 from public.site_content
  where page = 'global-fluency' and content_key = 'intro_play'
);

commit;
