-- Course brochure PDFs.
-- Adds courses.pdf_url, creates the public course-pdfs bucket, and allows
-- anyone to read files in that bucket. It does not allow visitors to upload,
-- change, or delete files. Safe to run more than once.
-- Upload the PDF after this script, then run set-global-fluency-pdf-url.sql.

begin;

alter table public.courses
  add column if not exists pdf_url text;

comment on column public.courses.pdf_url is
  'Public URL of the course description PDF in Supabase Storage. Leave blank when no PDF is configured.';

insert into storage.buckets (id, name, public)
values ('course-pdfs', 'course-pdfs', true)
on conflict (id) do update
set public = true;

drop policy if exists course_pdfs_public_read on storage.objects;
create policy course_pdfs_public_read
on storage.objects
for select
to public
using (bucket_id = 'course-pdfs');

commit;
