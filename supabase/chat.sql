begin;
create table if not exists public.reservations (
  id uuid primary key,
  visitor_hash text not null,
  items jsonb not null,
  total bigint not null,
  created_at timestamptz not null default now()
);
create table if not exists public.reservation_messages (
  id uuid primary key,
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  sender text not null check (sender in ('staff','visitor')),
  body text not null check (length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists reservation_messages_thread on public.reservation_messages(reservation_id, created_at);
alter table public.reservations enable row level security;
alter table public.reservation_messages enable row level security;
revoke all on public.reservations, public.reservation_messages from public, anon, authenticated;
grant select, insert on public.reservations, public.reservation_messages to service_role;
commit;
