-- Set Global Fluency course-description heading to the full bilingual line.
-- Rendered via description_word only (first word #333, remainder #061E38).
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

update public.site_content
set
  value_en = 'Course Description',
  value_fr = 'Description de la Formation'
where page = 'global-fluency' and content_key = 'description_word';

commit;
