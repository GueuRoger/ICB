-- Seed Global Fluency different_body from the former catalog fallback.
-- Run in the Supabase SQL editor (publishable key cannot UPDATE site_content).
-- After this, edit value_en / value_fr on this row to change the live text.

begin;

update public.site_content
set
  value_en = $icb$It's simple. In this program you get work with Roger, who is a software engineer, inventor and entrepreneur. He grew up in rural francophone Africa and rose to the world stage through self-reliance. He acquire English and Spanish through unconventional methods mostly for his own desire to have a seat on world stage. And today he share just that with hundreds of corporate leaders from around the world who simply can't afford to be viewed as a second class citizen in front of their international peers$icb$,
  value_fr = $icb$C'est simple. Dans ce programme, vous travaillez avec Roger, ingénieur logiciel, inventeur et entrepreneur. Il a grandi dans une zone rurale d'Afrique francophone et a atteint la scène mondiale par lui-même. Il a appris l'anglais et l'espagnol par des méthodes peu conventionnelles, surtout pour prendre place sur cette scène. Aujourd'hui, il transmet cela à des centaines de dirigeants qui ne peuvent pas se permettre d'être perçus comme des interlocuteurs de second rang face à leurs pairs internationaux.$icb$
where page = 'global-fluency' and content_key = 'different_body';

commit;
