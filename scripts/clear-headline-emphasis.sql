-- Restore headline_emphasis ("Your ultimate system to…") and clear
-- obsolete headline_lead ("Your ultimate program to ").
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

-- Restore the text that was incorrectly cleared.
update public.site_content
set
  value_en = $icb$Your ultimate system to live in English the way you do French, land the top jobs top international companies and institutions$icb$,
  value_fr = $icb$Votre système ultime pour vivre l’anglais comme vous vivez le français et décrocher les meilleurs postes au sein des grandes entreprises et institutions internationales.$icb$
where page = 'global-fluency' and content_key = 'headline_emphasis';

-- Remove the other "Your ultimate…" line (lead).
update public.site_content
set value_en = '', value_fr = ''
where page = 'global-fluency' and content_key = 'headline_lead';

commit;
