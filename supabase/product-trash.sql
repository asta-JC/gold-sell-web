begin;
alter table public.products add column if not exists deleted_at timestamptz;
create index if not exists products_deleted_at_idx on public.products(deleted_at) where deleted_at is not null;
alter policy "Published products are visible" on public.products using (status = 'published' and deleted_at is null);

create or replace function public.trash_product(product_id uuid, restore boolean default false)
returns uuid language plpgsql security definer set search_path = '' as $$
declare affected uuid;
begin
  if not exists (select 1 from public.staff where user_id = auth.uid()) then
    raise exception 'Staff access required' using errcode = '42501';
  end if;
  if restore then
    update public.products set deleted_at = null, status = 'draft'
      where id = product_id and deleted_at > now() - interval '72 hours'
      returning id into affected;
  else
    update public.products set deleted_at = now(), status = 'archived'
      where id = product_id and deleted_at is null returning id into affected;
  end if;
  return affected;
end $$;
revoke all on function public.trash_product(uuid, boolean) from public, anon;
grant execute on function public.trash_product(uuid, boolean) to authenticated;

create extension if not exists pg_cron;
-- Run every minute; only products explicitly deleted at least 72 hours ago qualify.
select cron.schedule('m-gold-purge-products', '* * * * *',
  $job$delete from public.products where deleted_at <= now() - interval '72 hours'$job$);
commit;
