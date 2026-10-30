-- Short sidebar label for Proven Content & Resources (heading stays on resources).
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

update public.site_content
set
  value_en = 'Content & Resources',
  value_fr = 'Contenus et ressources'
where page = 'global-fluency' and content_key = 'link_resources';

commit;
