-- Align World Stage course slug with the app (loadCourse("world-stage")).
-- Does not change name_en / name_fr.
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

update public.courses
set slug = 'world-stage'
where id = '77536ce7-e0e5-4a9d-8960-33786caa3898'
  and slug = 'World stage';

commit;
