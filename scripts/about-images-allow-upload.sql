-- Temporary: allow uploads into course-pdfs/about/* so publishable key can push the three photos.
-- Run in SQL editor, then: node scripts/upload-about-images.mjs
-- Then run about-images-urls.sql. Optionally drop this policy afterward.

begin;

drop policy if exists course_pdfs_about_upload on storage.objects;
create policy course_pdfs_about_upload
on storage.objects
for insert
to anon, authenticated
with check (
  bucket_id = 'course-pdfs'
  and (storage.foldername(name))[1] = 'about'
);

drop policy if exists course_pdfs_about_update on storage.objects;
create policy course_pdfs_about_update
on storage.objects
for update
to anon, authenticated
using (
  bucket_id = 'course-pdfs'
  and (storage.foldername(name))[1] = 'about'
)
with check (
  bucket_id = 'course-pdfs'
  and (storage.foldername(name))[1] = 'about'
);

commit;
