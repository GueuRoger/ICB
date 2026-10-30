-- Remove unused Global Fluency offering title line (was falling back to catalog "mentorship").
-- Full title lives in offer_1_title_1 (e.g. "90-Day Transformation").
-- Run in the Supabase SQL editor (publishable key cannot DELETE).

delete from public.site_content
where page = 'global-fluency' and content_key = 'offer_1_title_2';
