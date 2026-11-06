begin;
alter table public.reservations add column if not exists archived_at timestamptz;
grant update (archived_at) on public.reservations to service_role;
commit;
