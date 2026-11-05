begin;

create table public.staff (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.staff enable row level security;
revoke all on public.staff from anon, authenticated;
grant select on public.staff to authenticated;

create policy "Staff can read their own membership"
  on public.staff for select to authenticated
  using (user_id = (select auth.uid()));

create table public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null check (length(trim(sku)) between 1 and 40),
  category text not null check (category in ('rings', 'earrings', 'bracelets', 'necklaces', 'sets')),
  uz text not null check (length(trim(uz)) between 1 and 100),
  ru text not null check (length(trim(ru)) between 1 and 100),
  "descUz" text not null check (length(trim("descUz")) between 1 and 1500),
  "descRu" text not null check (length(trim("descRu")) between 1 and 1500),
  price bigint not null check (price between 1 and 999999999),
  purity text not null check (purity ~ '^[1-9][0-9]{0,2}$'),
  weight numeric(6,2) not null check (weight between 0.01 and 9999),
  size text not null default '' check (length(size) <= 40),
  photo text not null check (length(trim(photo)) between 1 and 512),
  available boolean not null default true,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now()
);

create unique index products_sku_unique on public.products (upper(trim(sku)));

alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update on public.products to authenticated;

create policy "Published products are visible"
  on public.products for select to anon, authenticated
  using (status = 'published');

create policy "Staff can read the full catalog"
  on public.products for select to authenticated
  using (exists (select 1 from public.staff where user_id = (select auth.uid())));

create policy "Staff can add products"
  on public.products for insert to authenticated
  with check (exists (select 1 from public.staff where user_id = (select auth.uid())));

create policy "Staff can edit products"
  on public.products for update to authenticated
  using (exists (select 1 from public.staff where user_id = (select auth.uid())))
  with check (exists (select 1 from public.staff where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-photos', 'product-photos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp']);

create policy "Staff can upload product photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'product-photos'
    and exists (select 1 from public.staff where user_id = (select auth.uid()))
  );

commit;
