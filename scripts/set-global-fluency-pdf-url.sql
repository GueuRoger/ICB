-- Connects the Global Fluency brochure that is already in Storage.
-- The uploaded object is at the bucket root, not inside the empty
-- global-fluency folder. Running this again resets courses.pdf_url
-- to that public URL.
--
--   bucket: course-pdfs
--   path:   Global_Fluency_Career_Program_Bilingual.pdf

update public.courses
set pdf_url = 'https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/course-pdfs/Global_Fluency_Career_Program_Bilingual.pdf'
where slug = 'global-fluency';
