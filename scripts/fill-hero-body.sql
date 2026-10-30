-- Seed Global Fluency hero_body from the former catalog fallback.
-- Run in the Supabase SQL editor (publishable key cannot UPDATE site_content).
-- After this, edit value_en / value_fr on this row to change the live text.

begin;

update public.site_content
set
  value_en = $icb$The solution to our problems lay not in books or trainings but in our own minds. You are abrilliant person in your field already more difficult than English, why would English be difficult for you, to the point of even blocking your progress?$icb$,
  value_fr = $icb$La solution à nos difficultés ne se trouve pas dans les livres ou les formations, mais dans notre propre esprit. Vous êtes déjà brillant dans un domaine plus difficile que l'anglais : pourquoi l'anglais vous bloquerait-il au point d'arrêter votre progression ?$icb$
where page = 'global-fluency' and content_key = 'hero_body';

commit;
