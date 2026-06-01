
-- Roles enum and table
create type public.app_role as enum ('admin', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  original_url text not null,
  title text,
  password text,
  is_active boolean not null default true,
  expires_at timestamptz,
  open_in_new_tab boolean not null default true,
  category text,
  tags text[] not null default '{}',
  click_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index links_user_id_idx on public.links(user_id);
create index links_slug_idx on public.links(slug);

create table public.link_clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  ip text,
  country text,
  city text,
  browser text,
  os text,
  device text,
  referrer text
);
create index link_clicks_link_id_idx on public.link_clicks(link_id);
create index link_clicks_clicked_at_idx on public.link_clicks(clicked_at);

create table public.site_settings (
  id integer primary key default 1,
  site_name text not null default 'RSLink by Mulyawan',
  tagline text not null default 'Platform URL Shortener untuk Civitas SMA Riyadhussholihiin',
  logo_url text,
  favicon_url text,
  meta_description text default 'Pendekkan, kelola, dan pantau link Anda dengan mudah.',
  hero_headline text not null default 'Pendekkan, Kelola, dan Pantau Link Anda dengan Mudah',
  hero_subheadline text not null default 'Platform URL Shortener modern untuk civitas SMA Riyadhussholihiin.',
  hero_cta text not null default 'Pendekkan Sekarang',
  footer_description text default 'Platform URL Shortener modern untuk seluruh civitas SMA Riyadhussholihiin.',
  contact_email text default 'info@riyadhussholihiin.sch.id',
  contact_address text default 'SMA Riyadhussholihiin',
  social_instagram text,
  social_facebook text,
  social_youtube text,
  copyright_text text default '© RSLink by Mulyawan',
  updated_at timestamptz not null default now(),
  constraint site_settings_single_row check (id = 1)
);
insert into public.site_settings (id) values (1);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
insert into public.faqs (question, answer, sort_order) values
  ('Apakah RSLink gratis untuk civitas?', 'Ya, RSLink gratis untuk seluruh civitas SMA Riyadhussholihiin.', 1),
  ('Apakah link saya akan kedaluwarsa?', 'Tidak otomatis. Anda dapat mengatur masa berlaku link sendiri.', 2),
  ('Apakah saya bisa membuat slug sendiri?', 'Bisa. Gunakan fitur Custom Back-Half.', 3),
  ('Apakah link saya aman?', 'Anda dapat melindungi link dengan password.', 4),
  ('Apakah ada QR Code otomatis?', 'Ya, setiap link memiliki QR Code yang dapat diunduh.', 5),
  ('Apakah saya bisa melihat statistik klik?', 'Tentu. Setiap link memiliki halaman analitik lengkap.', 6);

-- has_role helper (SECURITY DEFINER)
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- handle_new_user trigger: create profile + default role
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger set_links_updated_at before update on public.links
  for each row execute function public.set_updated_at();
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

-- GRANTS
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

grant select, insert, update, delete on public.links to authenticated;
grant select on public.links to anon;
grant all on public.links to service_role;

grant select, insert on public.link_clicks to authenticated;
grant select, insert on public.link_clicks to anon;
grant all on public.link_clicks to service_role;

grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

grant select on public.faqs to anon, authenticated;
grant insert, update, delete on public.faqs to authenticated;
grant all on public.faqs to service_role;

-- RLS
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.links enable row level security;
alter table public.link_clicks enable row level security;
alter table public.site_settings enable row level security;
alter table public.faqs enable row level security;

-- profiles
create policy "Users view own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Admins view all profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

-- user_roles
create policy "Users view own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);
create policy "Admins view all roles" on public.user_roles for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- links: owners full CRUD; anon/auth can SELECT active non-expired (for redirect)
create policy "Owners select own links" on public.links for select to authenticated using (auth.uid() = user_id);
create policy "Public select active links" on public.links for select to anon, authenticated
  using (is_active = true and (expires_at is null or expires_at > now()));
create policy "Owners insert links" on public.links for insert to authenticated with check (auth.uid() = user_id);
create policy "Owners update links" on public.links for update to authenticated using (auth.uid() = user_id);
create policy "Owners delete links" on public.links for delete to authenticated using (auth.uid() = user_id);
create policy "Admins manage links" on public.links for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- link_clicks: anyone can insert; only link owners can view
create policy "Anyone insert click" on public.link_clicks for insert to anon, authenticated with check (true);
create policy "Owners view clicks" on public.link_clicks for select to authenticated
  using (exists (select 1 from public.links l where l.id = link_clicks.link_id and l.user_id = auth.uid()));
create policy "Admins view all clicks" on public.link_clicks for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- site_settings: public read, admin update
create policy "Anyone read site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "Admins update site settings" on public.site_settings for update to authenticated using (public.has_role(auth.uid(), 'admin'));

-- faqs: public read, admin CRUD
create policy "Anyone read faqs" on public.faqs for select to anon, authenticated using (true);
create policy "Admins manage faqs" on public.faqs for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
