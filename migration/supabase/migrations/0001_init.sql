-- Custom Stock Status Type Enum
create type public.stock_status_type as enum ('in_stock', 'limited', 'sold_out');

-- 1. Admin Users table
create table public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Categories table
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Products table
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category_id uuid references public.categories(id) on delete set null,
  colour text,
  finish text,
  thickness_options text[] not null default '{}',
  image_urls text[] not null default '{}',
  description text,
  stock_status public.stock_status_type default 'in_stock'::public.stock_status_type not null,
  is_featured boolean default false not null,
  is_new_arrival boolean default false not null,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  image_urls text[] not null default '{}',
  location text,
  completion_date date,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Testimonials table
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_title text,
  company text,
  quote text not null,
  avatar_url text,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Blog Posts table
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image text,
  published_at timestamp with time zone,
  is_published boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Enquiries table
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Site Settings table
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) Enablement
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
alter table public.blog_posts enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

-- Helper security definer function to check if user is an admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- RLS Policies

-- Admin Users policies
create policy "Allow read for self on admin_users" on public.admin_users
  for select to authenticated using (auth.uid() = id);

create policy "Admin full access on admin_users" on public.admin_users
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Categories policies
create policy "Public SELECT published categories" on public.categories
  for select to public using (is_published = true);

create policy "Admin full access on categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Products policies
create policy "Public SELECT published products" on public.products
  for select to public using (is_published = true);

create policy "Admin full access on products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Projects policies
create policy "Public SELECT published projects" on public.projects
  for select to public using (is_published = true);

create policy "Admin full access on projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Testimonials policies
create policy "Public SELECT published testimonials" on public.testimonials
  for select to public using (is_published = true);

create policy "Admin full access on testimonials" on public.testimonials
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Blog Posts policies
create policy "Public SELECT published blog_posts" on public.blog_posts
  for select to public using (is_published = true);

create policy "Admin full access on blog_posts" on public.blog_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Enquiries policies
create policy "Public INSERT enquiries" on public.enquiries
  for insert to public with check (true);

create policy "Admin full access on enquiries" on public.enquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Site Settings policies
create policy "Public SELECT site_settings" on public.site_settings
  for select to public using (true);

create policy "Admin full access on site_settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
