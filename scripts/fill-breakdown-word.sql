-- Set Global Fluency course-breakdown heading to the full bilingual line.
-- Rendered via breakdown_word only (first word #333, remainder #061E38).
-- Clears obsolete course_word (no longer used on this page).
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

update public.site_content
set
  value_en = 'Course Breakdown',
  value_fr = 'Découpage de la Formation'
where page = 'global-fluency' and content_key = 'breakdown_word';

update public.site_content
set value_en = '', value_fr = ''
where page = 'global-fluency' and content_key = 'course_word';

commit;
