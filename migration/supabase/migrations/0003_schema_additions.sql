-- Migration: Add fields for Portfolio category and Lead tracking statuses

-- 1. Enquiries Table status addition
alter table public.enquiries 
add column if not exists status text default 'New' not null;

alter table public.enquiries
drop constraint if exists enquiries_status_check;

alter table public.enquiries
add constraint enquiries_status_check check (status in ('New', 'Contacted', 'Converted', 'Lost'));

-- 2. Projects Table columns addition
alter table public.projects 
add column if not exists category text default 'residential' not null;

alter table public.projects
drop constraint if exists projects_category_check;

alter table public.projects
add constraint projects_category_check check (category in ('residential', 'hospitality', 'commercial'));

alter table public.projects
add column if not exists stone_products_used text[] default '{}'::text[] not null;

-- 3. Idempotent rename blog_posts.content to body_markdown
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='blog_posts' AND column_name='content'
  ) THEN
    ALTER TABLE public.blog_posts RENAME COLUMN content TO body_markdown;
  END IF;
END $$;

