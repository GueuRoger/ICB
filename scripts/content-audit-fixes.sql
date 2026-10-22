-- Adds the text records found by the site-wide content audit.
-- Safe to run more than once: existing page + content_key rows are left unchanged.
-- Removes only the unused Global Fluency sidebar price. Course prices stay on courses.price.

insert into public.site_content (page, section, content_key, value_en, value_fr)
select v.page, v.section, v.content_key, v.value_en, v.value_fr
from (
  values
    ('login', 'form', 'error_invalid', $en$The email or password is not correct.$en$, $fr$L'e-mail ou le mot de passe est incorrect.$fr$),
    ('login', 'form', 'error_confirm', $en$Confirm your email before signing in.$en$, $fr$Confirmez votre e-mail avant de vous connecter.$fr$),
    ('payments', 'message', 'failure_message', $en$The payment could not be prepared. Try again.$en$, $fr$Le paiement n'a pas pu être préparé. Réessayez.$fr$),
    ('payments', 'message', 'request_title', $en$ICB payment request$en$, $fr$Demande de paiement ICB$fr$),
    ('payments', 'message', 'label_name', $en$Name$en$, $fr$Nom$fr$),
    ('payments', 'message', 'label_email', $en$Email$en$, $fr$E-mail$fr$),
    ('payments', 'message', 'label_courses', $en$Courses$en$, $fr$Cours$fr$),
    ('payments', 'message', 'label_total', $en$Total$en$, $fr$Total$fr$),
    ('payments', 'message', 'label_method', $en$Payment method$en$, $fr$Mode de paiement$fr$),
    ('payments', 'message', 'label_reference', $en$Reference$en$, $fr$Référence$fr$),
    ('payments', 'message', 'method_wave', $en$Wave$en$, $fr$Wave$fr$),
    ('payments', 'message', 'method_card', $en$Credit card$en$, $fr$Carte bancaire$fr$),
    ('payments', 'message', 'customer_fallback', $en$Customer$en$, $fr$Client$fr$),
    ('payments', 'message', 'currency_code', $en$USD$en$, $fr$USD$fr$),
    ('shared', 'money', 'currency_symbol', $en$$$en$, $fr$$$fr$),
    ('shared', 'money', 'currency_symbol_us', $en$US$$en$, $fr$US$$fr$)
) as v(page, section, content_key, value_en, value_fr)
where not exists (
  select 1
  from public.site_content existing
  where existing.page = v.page
    and existing.content_key = v.content_key
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select 'world-stage-apply', 'legal', source.content_key, source.value_en, source.value_fr
from public.site_content source
where source.page = 'checkout'
  and source.content_key in ('terms_intro', 'terms', 'terms_and', 'privacy', 'terms_end', 'phone_consent')
  and not exists (
    select 1
    from public.site_content existing
    where existing.page = 'world-stage-apply'
      and existing.content_key = source.content_key
  );

delete from public.site_content
where page = 'global-fluency'
  and section = 'sidebar'
  and content_key = 'price';
