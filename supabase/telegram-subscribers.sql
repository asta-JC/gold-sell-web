begin;
create table if not exists public.telegram_subscribers (
  chat_id bigint primary key,
  update_id bigint not null,
  active boolean not null
);
alter table public.telegram_subscribers enable row level security;
revoke all on public.telegram_subscribers from public, anon, authenticated;
grant select, insert, update on public.telegram_subscribers to service_role;

create or replace function public.set_telegram_subscription(
  subscriber_id bigint, telegram_update_id bigint, subscribed boolean
) returns void language sql set search_path = '' as $$
  insert into public.telegram_subscribers (chat_id, update_id, active)
  values (subscriber_id, telegram_update_id, subscribed)
  on conflict (chat_id) do update
    set update_id = excluded.update_id, active = excluded.active
    where telegram_subscribers.update_id < excluded.update_id;
$$;
revoke all on function public.set_telegram_subscription(bigint,bigint,boolean) from public, anon, authenticated;
grant execute on function public.set_telegram_subscription(bigint,bigint,boolean) to service_role;
commit;
