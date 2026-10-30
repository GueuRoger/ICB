-- Point each About image CMS key at its Storage public URL (independent per photo).
-- Run AFTER the about bucket exists and node scripts/upload-about-images.mjs succeeds.

begin;

update public.site_content
set
  value_en = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/about/speaker.png',
  value_fr = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/about/speaker.png'
where page = 'about' and content_key = 'speaker_image';

update public.site_content
set
  value_en = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/about/engineer.png',
  value_fr = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/about/engineer.png'
where page = 'about' and content_key = 'engineer_image';

update public.site_content
set
  value_en = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/about/inventor.png',
  value_fr = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/about/inventor.png'
where page = 'about' and content_key = 'inventor_image';

commit;
