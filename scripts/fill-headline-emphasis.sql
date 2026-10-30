-- Ensure Global Fluency headline_emphasis holds the currently displayed copy.
-- Catalog fallback for this key is empty — edit this row to change the live H1.
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

update public.site_content
set
  value_en = $icb$Your ultimate system to live in English the way you do French, land the top jobs top international companies and institutions$icb$,
  value_fr = $icb$Votre système ultime pour vivre l’anglais comme vous vivez le français et décrocher les meilleurs postes au sein des grandes entreprises et institutions internationales.$icb$
where page = 'global-fluency' and content_key = 'headline_emphasis';

commit;
