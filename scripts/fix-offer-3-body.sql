-- Fix Global Fluency offering 3 body EN; keep FR companion lines.
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

update public.site_content
set value_en = 'You access a community of other speakers.'
where page = 'global-fluency' and content_key = 'offer_3_body_1';

-- Keep rows for French value_fr; EN already empty (full sentence in body_1).
update public.site_content
set value_en = ''
where page = 'global-fluency' and content_key in ('offer_3_body_2', 'offer_3_body_3');

commit;
