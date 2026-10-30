-- Create public `about` Storage bucket + read/write policies.
-- Run in the Supabase SQL editor, then: node scripts/upload-about-images.mjs
-- Then run scripts/about-images-urls.sql to point site_content at the public URLs.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'about',
  'about',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/jpg']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists about_images_public_read on storage.objects;
create policy about_images_public_read
on storage.objects
for select
to public
using (bucket_id = 'about');

drop policy if exists about_images_public_insert on storage.objects;
create policy about_images_public_insert
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'about');

drop policy if exists about_images_public_update on storage.objects;
create policy about_images_public_update
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'about')
with check (bucket_id = 'about');

commit;
