begin;

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$signup$icb$, $icb$form$icb$, $icb$first_name$icb$, $icb$First Name$icb$, $icb$Prénom$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$signup$icb$ and content_key = $icb$first_name$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$signup$icb$, $icb$form$icb$, $icb$last_name$icb$, $icb$Last Name$icb$, $icb$Nom$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$signup$icb$ and content_key = $icb$last_name$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$signup$icb$, $icb$form$icb$, $icb$error_exists$icb$, $icb$An account with this email already exists.$icb$, $icb$Un compte existe déjà avec cette adresse e-mail.$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$signup$icb$ and content_key = $icb$error_exists$icb$
);

insert into public.site_content (page, section, content_key, value_en, value_fr)
select $icb$signup$icb$, $icb$form$icb$, $icb$error_create$icb$, $icb$The account could not be created. Try again.$icb$, $icb$Le compte n'a pas pu être créé. Réessayez.$icb$
where not exists (
  select 1 from public.site_content
  where page = $icb$signup$icb$ and content_key = $icb$error_create$icb$
);

do $icb$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype in ('p', 'u')
      and pg_get_constraintdef(oid) like '%(id)%'
  ) then
    alter table public.profiles add primary key (id);
  end if;
exception
  when others then
    raise notice 'Skipped profiles primary key: %', sqlerrm;
end
$icb$;

do $icb$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and contype = 'f'
      and confrelid = 'auth.users'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_id_fkey
      foreign key (id) references auth.users (id) on delete cascade;
  end if;
exception
  when others then
    raise notice 'Skipped profiles foreign key: %', sqlerrm;
end
$icb$;

create or replace function public.handle_new_student_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $icb$
begin
  insert into public.profiles (id, first_name, last_name, email, updated_at)
  values (
    new.id,
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'first_name', '')), ''),
    nullif(btrim(coalesce(new.raw_user_meta_data ->> 'last_name', '')), ''),
    new.email,
    now()
  )
  on conflict (id) do update
  set first_name = excluded.first_name,
      last_name = excluded.last_name,
      email = excluded.email,
      updated_at = now();
  return new;
end;
$icb$;

drop trigger if exists on_auth_user_created_student_profile on auth.users;
create trigger on_auth_user_created_student_profile
after insert on auth.users
for each row
execute procedure public.handle_new_student_profile();

insert into public.profiles (id, first_name, last_name, email, updated_at)
select
  users.id,
  nullif(btrim(coalesce(users.raw_user_meta_data ->> 'first_name', '')), ''),
  nullif(btrim(coalesce(users.raw_user_meta_data ->> 'last_name', '')), ''),
  users.email,
  now()
from auth.users as users
where not exists (
  select 1 from public.profiles where profiles.id = users.id
);

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

grant select, insert, update on table public.profiles to authenticated;

commit;
