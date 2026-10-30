-- Set Global Fluency proven-content heading to the full bilingual line.
-- Rendered via resources only (all but last word #333, last word #061E38).
-- Clears obsolete proven companion.
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

update public.site_content
set
  value_en = 'Proven Content & Resources',
  value_fr = 'Contenus et ressources éprouvés'
where page = 'global-fluency' and content_key = 'resources';

update public.site_content
set value_en = '', value_fr = ''
where page = 'global-fluency' and content_key = 'proven';

commit;
