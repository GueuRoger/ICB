-- Orphan row: heading already includes "International Speaker".
-- Run in the Supabase SQL editor (publishable key cannot DELETE).
delete from public.site_content
where page = 'about' and content_key = 'speaker_kicker';
