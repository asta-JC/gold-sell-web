begin;
alter table public.products
  drop constraint if exists "products_descUz_check",
  drop constraint if exists "products_descRu_check",
  alter column "descUz" set default '',
  alter column "descRu" set default '',
  add constraint "products_descUz_check" check (length(trim("descUz")) <= 1500),
  add constraint "products_descRu_check" check (length(trim("descRu")) <= 1500);
commit;
