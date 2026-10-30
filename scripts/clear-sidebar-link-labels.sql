-- Clear obsolete Global Fluency sidebar link_* labels.
-- Sidebar now reads the same keys as section headings:
--   description_word, breakdown_word, technology, resources, faqs
-- Run in the Supabase SQL editor (publishable key cannot UPDATE).

begin;

update public.site_content
set value_en = '', value_fr = ''
where page = 'global-fluency'
  and content_key in (
    'link_description',
    'link_breakdown',
    'link_technology',
    'link_faqs'
  );
-- link_resources kept: short sidebar label ("Content & Resources").

commit;
