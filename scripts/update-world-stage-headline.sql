-- World Stage hero: one CMS headline string (frontend splits white + blue).
-- Run in the Supabase SQL editor (publishable key cannot UPDATE site_content).
--
-- Single source (page = world-stage, section = hero):
--   sr_heading         id = f02d7af9-eba3-400f-8d1f-e76b07a846a3
-- Cleared (no longer used for the hero headline):
--   headline_lead      id = 011e4f67-e1a0-46a7-813c-a3c193882747
--   headline_emphasis  id = d4b93a50-a03d-4b3f-98c2-306e5542e679

begin;

update public.site_content
set
  value_en = $icb$Give your career the global opportunities it deserves$icb$,
  value_fr = $icb$Donnez à votre carrière les opportunités internationales qu'elle mérite$icb$
where id = $icb$f02d7af9-eba3-400f-8d1f-e76b07a846a3$icb$
  and page = $icb$world-stage$icb$
  and content_key = $icb$sr_heading$icb$;

update public.site_content
set value_en = $icb$$icb$, value_fr = $icb$$icb$
where id = $icb$011e4f67-e1a0-46a7-813c-a3c193882747$icb$
  and page = $icb$world-stage$icb$
  and content_key = $icb$headline_lead$icb$;

update public.site_content
set value_en = $icb$$icb$, value_fr = $icb$$icb$
where id = $icb$d4b93a50-a03d-4b3f-98c2-306e5542e679$icb$
  and page = $icb$world-stage$icb$
  and content_key = $icb$headline_emphasis$icb$;

commit;
