-- Create public `global-fluency` Storage bucket for intro thumbnail + video.
-- Run in the Supabase SQL editor, then upload files (Dashboard or upload script),
-- then run scripts/global-fluency-intro-urls.sql.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'global-fluency',
  'global-fluency',
  true,
  524288000,
  array[
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists global_fluency_public_read on storage.objects;
create policy global_fluency_public_read
on storage.objects
for select
to public
using (bucket_id = 'global-fluency');

-- Optional: allow publishable-key uploads (Dashboard uploads work without these).
drop policy if exists global_fluency_public_insert on storage.objects;
create policy global_fluency_public_insert
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'global-fluency');

drop policy if exists global_fluency_public_update on storage.objects;
create policy global_fluency_public_update
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'global-fluency')
with check (bucket_id = 'global-fluency');

commit;
