-- Set Global Fluency innovative-technology heading to the full bilingual line.
-- Rendered via technology only (first word #333, remainder #061E38).
-- Clears obsolete innovative companion.
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

update public.site_content
set
  value_en = 'Innovative Technology',
  value_fr = 'Technologie Innovante'
where page = 'global-fluency' and content_key = 'technology';

update public.site_content
set value_en = '', value_fr = ''
where page = 'global-fluency' and content_key = 'innovative';

commit;
