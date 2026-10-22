begin;

alter table public.site_content enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.news enable row level security;

revoke insert, update, delete, truncate on table public.site_content from public, anon, authenticated;
revoke insert, update, delete, truncate on table public.courses from public, anon, authenticated;
revoke insert, update, delete, truncate on table public.course_modules from public, anon, authenticated;
revoke insert, update, delete, truncate on table public.news from public, anon, authenticated;

grant select on table public.site_content to anon, authenticated;
grant select on table public.courses to anon, authenticated;
grant select on table public.course_modules to anon, authenticated;
grant select on table public.news to anon, authenticated;

drop policy if exists site_content_public_read on public.site_content;
create policy site_content_public_read
on public.site_content
for select
to anon, authenticated
using (true);

drop policy if exists courses_public_read on public.courses;
create policy courses_public_read
on public.courses
for select
to anon, authenticated
using (
  status is null
  or btrim(status) = ''
  or lower(btrim(status)) in ('published', 'public', 'active')
);

drop policy if exists course_modules_public_read on public.course_modules;
create policy course_modules_public_read
on public.course_modules
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.courses
    where courses.id = course_modules.course_id
      and (
        courses.status is null
        or btrim(courses.status) = ''
        or lower(btrim(courses.status)) in ('published', 'public', 'active')
      )
  )
);

drop policy if exists news_public_read on public.news;
create policy news_public_read
on public.news
for select
to anon, authenticated
using (is_published is true);

commit;
