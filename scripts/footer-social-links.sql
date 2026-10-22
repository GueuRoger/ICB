-- Social profile URLs for the three footer icons.
-- Safe to run more than once: an existing page + content_key row is left unchanged.
-- Edit value_en / value_fr later in Table Editor to change a link without code changes.

insert into public.site_content (page, section, content_key, value_en, value_fr)
select v.page, v.section, v.content_key, v.value_en, v.value_fr
from (
  values
    ('shared', 'footer', 'footer_instagram_url', $en$https://www.instagram.com/roger_c_gueu/$en$, $fr$https://www.instagram.com/roger_c_gueu/$fr$),
    ('shared', 'footer', 'footer_linkedin_url', $en$https://www.linkedin.com/in/roger-gueu/$en$, $fr$https://www.linkedin.com/in/roger-gueu/$fr$),
    ('shared', 'footer', 'footer_facebook_url', $en$https://www.facebook.com/gueuhidekiyukawa$en$, $fr$https://www.facebook.com/gueuhidekiyukawa$fr$)
) as v(page, section, content_key, value_en, value_fr)
where not exists (
  select 1
  from public.site_content existing
  where existing.page = v.page
    and existing.content_key = v.content_key
);
