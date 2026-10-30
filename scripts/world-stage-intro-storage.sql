-- Create public `world-stage` Storage bucket for intro thumbnail + video.
-- Run in the Supabase SQL editor, then upload files (Dashboard or upload script),
-- then run scripts/world-stage-intro-urls.sql.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'world-stage',
  'world-stage',
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

drop policy if exists world_stage_public_read on storage.objects;
create policy world_stage_public_read
on storage.objects
for select
to public
using (bucket_id = 'world-stage');

-- Optional: allow publishable-key uploads (Dashboard uploads work without these).
drop policy if exists world_stage_public_insert on storage.objects;
create policy world_stage_public_insert
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'world-stage');

drop policy if exists world_stage_public_update on storage.objects;
create policy world_stage_public_update
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'world-stage')
with check (bucket_id = 'world-stage');

commit;
