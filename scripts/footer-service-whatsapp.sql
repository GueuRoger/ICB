-- WhatsApp messages for the four footer services.
-- The service names already exist as footer_speaking, footer_consulting,
-- footer_media, and footer_corporate. This adds only their message text.
-- Safe to run more than once: an existing page + content_key row is left unchanged.

insert into public.site_content (page, section, content_key, value_en, value_fr)
select v.page, v.section, v.content_key, v.value_en, v.value_fr
from (
  values
    ('shared', 'footer', 'footer_speaking_message', $en$Hello, I am interested in Speaking engagement. I would like to discuss the details.$en$, $fr$Bonjour, je suis intéressé par « Conférence ». J'aimerais discuter des détails.$fr$),
    ('shared', 'footer', 'footer_consulting_message', $en$Hello, I am interested in Private consulting. I would like to discuss the details.$en$, $fr$Bonjour, je suis intéressé par « Conseil privé ». J'aimerais discuter des détails.$fr$),
    ('shared', 'footer', 'footer_media_message', $en$Hello, I am interested in Media appearances. I would like to discuss the details.$en$, $fr$Bonjour, je suis intéressé par « Médias ». J'aimerais discuter des détails.$fr$),
    ('shared', 'footer', 'footer_corporate_message', $en$Hello, I am interested in Corporate services. I would like to discuss the details.$en$, $fr$Bonjour, je suis intéressé par « Services aux entreprises ». J'aimerais discuter des détails.$fr$)
) as v(page, section, content_key, value_en, value_fr)
where not exists (
  select 1
  from public.site_content existing
  where existing.page = v.page
    and existing.content_key = v.content_key
);
