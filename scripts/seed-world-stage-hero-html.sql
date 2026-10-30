-- World Stage banner: HTML text keys + photo-only background.
-- Run in the Supabase SQL editor (publishable key cannot write site_content).
-- Replaces flattened world-stage-hero.png banner with editable EN/FR copy.

begin;

-- Point hero_image at the text-free Figma background extract.
update public.site_content
set
  value_en = $icb$/images/world-stage-hero-bg.png$icb$,
  value_fr = $icb$/images/world-stage-hero-bg.png$icb$
where page = $icb$world-stage$icb$
  and content_key = $icb$hero_image$icb$;

-- Keep existing apply / sr_heading aligned with the live banner.
update public.site_content
set
  value_en = $icb$Carry the full weight of your role on the world stage$icb$,
  value_fr = $icb$Portez tout le poids de votre rôle sur la scène mondiale$icb$
where page = $icb$world-stage$icb$
  and content_key = $icb$sr_heading$icb$;

update public.site_content
set
  value_en = $icb$Apply to World Stage$icb$,
  value_fr = $icb$Postuler à World Stage$icb$
where page = $icb$world-stage$icb$
  and content_key = $icb$apply$icb$;

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage$icb$, $icb$hero$icb$, $icb$hero_tagline$icb$,
  $icb$A stronger voice for a more stable world$icb$,
  $icb$Une voix plus forte pour un monde plus stable$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$hero_tagline$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage$icb$, $icb$hero$icb$, $icb$headline_lead$icb$,
  $icb$CARRY THE FULL WEIGHT OF YOUR ROLE$icb$,
  $icb$PORTEZ TOUT LE POIDS DE VOTRE RÔLE$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$headline_lead$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage$icb$, $icb$hero$icb$, $icb$headline_emphasis$icb$,
  $icb$ON THE WORLD STAGE$icb$,
  $icb$SUR LA SCÈNE MONDIALE$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$headline_emphasis$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage$icb$, $icb$hero$icb$, $icb$hero_body$icb$,
  $icb$A private 12-month mentorship for leaders who must communicate with clarity and credibility on the world stage$icb$,
  $icb$Un mentorat privé de 12 mois pour les dirigeants qui doivent communiquer avec clarté et crédibilité sur la scène mondiale$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$hero_body$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage$icb$, $icb$hero$icb$, $icb$hero_footer_1$icb$,
  $icb$BETTER EXPRESSION$icb$,
  $icb$MEILLEURE EXPRESSION$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$hero_footer_1$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage$icb$, $icb$hero$icb$, $icb$hero_footer_2$icb$,
  $icb$BRIGHTER FUTURE$icb$,
  $icb$AVENIR PLUS RADIEUX$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$hero_footer_2$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage$icb$, $icb$hero$icb$, $icb$hero_footer_3$icb$,
  $icb$MORE FULFILLMENT$icb$,
  $icb$PLUS D'ÉPANOUISSEMENT$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$hero_footer_3$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$world-stage$icb$, $icb$hero$icb$, $icb$hero_callout$icb$,
  $icb$NOW IS THE TIME TO TAKE YOUR SEAT ON THE WORLD TABLE$icb$,
  $icb$IL EST TEMPS DE PRENDRE VOTRE PLACE À LA TABLE MONDIALE$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$world-stage$icb$ and content_key = $icb$hero_callout$icb$
);

-- If rows already existed from a prior attempt, refresh values.
update public.site_content set value_en = $icb$A stronger voice for a more stable world$icb$, value_fr = $icb$Une voix plus forte pour un monde plus stable$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$hero_tagline$icb$;
update public.site_content set value_en = $icb$CARRY THE FULL WEIGHT OF YOUR ROLE$icb$, value_fr = $icb$PORTEZ TOUT LE POIDS DE VOTRE RÔLE$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$headline_lead$icb$;
update public.site_content set value_en = $icb$ON THE WORLD STAGE$icb$, value_fr = $icb$SUR LA SCÈNE MONDIALE$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$headline_emphasis$icb$;
update public.site_content set value_en = $icb$A private 12-month mentorship for leaders who must communicate with clarity and credibility on the world stage$icb$, value_fr = $icb$Un mentorat privé de 12 mois pour les dirigeants qui doivent communiquer avec clarté et crédibilité sur la scène mondiale$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$hero_body$icb$;
update public.site_content set value_en = $icb$BETTER EXPRESSION$icb$, value_fr = $icb$MEILLEURE EXPRESSION$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$hero_footer_1$icb$;
update public.site_content set value_en = $icb$BRIGHTER FUTURE$icb$, value_fr = $icb$AVENIR PLUS RADIEUX$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$hero_footer_2$icb$;
update public.site_content set value_en = $icb$MORE FULFILLMENT$icb$, value_fr = $icb$PLUS D'ÉPANOUISSEMENT$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$hero_footer_3$icb$;
update public.site_content set value_en = $icb$NOW IS THE TIME TO TAKE YOUR SEAT ON THE WORLD TABLE$icb$, value_fr = $icb$IL EST TEMPS DE PRENDRE VOTRE PLACE À LA TABLE MONDIALE$icb$
where page = $icb$world-stage$icb$ and content_key = $icb$hero_callout$icb$;

commit;
