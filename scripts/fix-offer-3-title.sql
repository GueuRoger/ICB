-- Fix Global Fluency offering 3 title EN; drop unused EN companion line.
-- Run in the Supabase SQL editor (publishable key cannot UPDATE/DELETE).

begin;

update public.site_content
set value_en = 'Access to an international environment'
where page = 'global-fluency' and content_key = 'offer_3_title_1';

-- Keep the row for French value_fr; clear obsolete EN stub.
update public.site_content
set value_en = ''
where page = 'global-fluency' and content_key = 'offer_3_title_2';

commit;
