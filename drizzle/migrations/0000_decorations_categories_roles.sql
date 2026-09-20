-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Users read own roles" on public.user_roles
for select to authenticated using (auth.uid() = user_id);

-- Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_es text not null,
  name_en text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;

alter table public.categories enable row level security;

create policy "Categories are public" on public.categories
for select to anon, authenticated using (true);

create policy "Admins manage categories" on public.categories
for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Decorations
create table public.decorations (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name_es text not null,
  name_en text not null,
  description_es text not null default '',
  description_en text not null default '',
  tag_es text not null default '',
  tag_en text not null default '',
  price numeric(10,2) not null default 0,
  image_url text not null default '',
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.decorations to anon;
grant select, insert, update, delete on public.decorations to authenticated;
grant all on public.decorations to service_role;

alter table public.decorations enable row level security;

create policy "Active decorations are public" on public.decorations
for select to anon using (is_active = true);

create policy "Authenticated read decorations" on public.decorations
for select to authenticated using (is_active = true or public.has_role(auth.uid(), 'admin'));

create policy "Admins manage decorations" on public.decorations
for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger decorations_touch_updated_at
before update on public.decorations
for each row execute function public.touch_updated_at();

-- Seed categories
insert into public.categories (slug, name_es, name_en, sort_order) values
  ('cumpleanos-ninos', 'Cumpleaños de niños', 'Kids birthdays', 1),
  ('cumpleanos-adultos', 'Cumpleaños de adultos', 'Adult birthdays', 2),
  ('graduaciones', 'Graduaciones', 'Graduations', 3),
  ('christmas', 'Navidad', 'Christmas', 4),
  ('bodas-eventos', 'Bodas y eventos', 'Weddings & events', 5);

-- Seed decorations
insert into public.decorations (category_id, name_es, name_en, description_es, description_en, tag_es, tag_en, price, image_url, sort_order)
values
  ((select id from public.categories where slug='cumpleanos-ninos'),
   'Arco orgánico de globos', 'Organic balloon arch',
   'Guirnalda de globos en tus colores, 8–10 pies, con detalles y follaje.',
   'Balloon garland in your colors, 8–10 ft, with details and greenery.',
   'Más pedido', 'Best seller', 250,
   '/__l5e/assets-v1/3a79588d-f47d-4747-9fa1-c3550436060c/Screenshot_from_2026-09-17_12-49-24.png', 1),
  ((select id from public.categories where slug='cumpleanos-ninos'),
   'Backdrop temático', 'Themed backdrop',
   'Panel impreso o personalizado con el nombre y tema del festejado.',
   'Printed or custom panel with the name and theme of the celebrant.',
   'Personalizado', 'Custom', 350,
   '/__l5e/assets-v1/13187967-e590-4027-ae0e-06d26126408e/Screenshot_from_2026-09-17_12-50-11.png', 2),
  ((select id from public.categories where slug='cumpleanos-ninos'),
   'Set completo de cumpleaños', 'Complete birthday set',
   'Backdrop, arco de globos, cilindros y tarima. Montaje incluido.',
   'Backdrop, balloon arch, cylinders and platform. Setup included.',
   'Todo incluido', 'All inclusive', 600,
   '/__l5e/assets-v1/52291cb9-d041-4172-bca3-db6e7aaecb4b/Screenshot_from_2026-09-17_12-50-01.png', 3),
  ((select id from public.categories where slug='cumpleanos-adultos'),
   'Muro verde o de flores', 'Green or flower wall',
   'Pared decorativa con letrero neón o letras doradas a elección.',
   'Decorative wall with a neon sign or gold letters of your choice.',
   'Elegante', 'Elegant', 300,
   '/__l5e/assets-v1/55b8daa6-ae86-4808-8655-b7830405a70e/Screenshot_from_2026-09-17_12-49-46.png', 4),
  ((select id from public.categories where slug='cumpleanos-adultos'),
   'Columnas de globos (par)', 'Balloon columns (pair)',
   'Dos columnas para la entrada o los laterales del área principal.',
   'Two columns for the entrance or the sides of the main area.',
   'Entrada', 'Entrance', 120,
   '/__l5e/assets-v1/52291cb9-d041-4172-bca3-db6e7aaecb4b/Screenshot_from_2026-09-17_12-50-01.png', 5),
  ((select id from public.categories where slug='graduaciones'),
   'Letra o número luminoso', 'Light-up letter or number',
   'Marquesina iluminada de 4 pies, rellena con globos si lo deseas.',
   '4-ft marquee light, filled with balloons if you wish.',
   'Add-on', 'Add-on', 90,
   '/__l5e/assets-v1/13187967-e590-4027-ae0e-06d26126408e/Screenshot_from_2026-09-17_12-50-11.png', 6),
  ((select id from public.categories where slug='christmas'),
   'Decoración navideña', 'Christmas decoration',
   'Ambientación navideña con globos, follaje y luces para casa o negocio.',
   'Christmas setup with balloons, greenery and lights for home or business.',
   'Temporada', 'Seasonal', 280,
   '/__l5e/assets-v1/55b8daa6-ae86-4808-8655-b7830405a70e/Screenshot_from_2026-09-17_12-49-46.png', 7);
