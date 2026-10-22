-- Read-only check. Do not insert, update, or delete.

select
  current_database() as database_name,
  current_user as database_user,
  current_schema() as current_schema,
  current_setting('search_path') as search_path,
  inet_server_addr() as server_address,
  inet_server_port() as server_port,
  version() as postgres_version;

select
  table_schema,
  table_name
from information_schema.tables
where table_name = 'payments'
order by table_schema;

select count(*) as payments_row_count
from public.payments;

select *
from public.payments
order by created_at;

select *
from public.payments
where reference = 'ICB-B0DB385956';
