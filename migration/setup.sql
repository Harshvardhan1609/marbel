-- ============================================================
-- ARIHANT MARBLES & GRANITE — PORTABLE ONE-SHOT DATABASE SETUP
-- Run this entire script in the Supabase SQL Editor to initialize all tables,
-- Row Level Security (RLS) policies, default branding settings, and the admin user.
-- ============================================================

-- 1. ENUMS & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_status_type') THEN
    CREATE TYPE public.stock_status_type AS ENUM ('in_stock', 'limited', 'sold_out');
  END IF;
END $$;

-- 2. CREATE MASTER TABLES
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  colours text[] DEFAULT '{}'::text[] NOT NULL,
  is_published boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  colour text,
  finish text,
  thickness_options text[] NOT NULL DEFAULT '{}',
  image_urls text[] NOT NULL DEFAULT '{}',
  description text,
  stock_status public.stock_status_type DEFAULT 'in_stock'::public.stock_status_type NOT NULL,
  is_featured boolean DEFAULT false NOT NULL,
  is_new_arrival boolean DEFAULT false NOT NULL,
  is_published boolean DEFAULT true NOT NULL,
  applications text[] DEFAULT '{}'::text[] NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_urls text[] NOT NULL DEFAULT '{}',
  location text,
  completion_date date,
  category text DEFAULT 'residential' NOT NULL CHECK (category IN ('residential', 'hospitality', 'commercial')),
  stone_products_used text[] DEFAULT '{}'::text[] NOT NULL,
  is_published boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_title text,
  company text,
  quote text NOT NULL,
  avatar_url text,
  is_published boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  body_markdown text NOT NULL,
  cover_image text,
  published_at timestamp with time zone,
  is_published boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  status text DEFAULT 'New' NOT NULL CHECK (status IN ('New', 'Contacted', 'Converted', 'Lost')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  bio text,
  image_url text NOT NULL,
  is_published boolean DEFAULT true NOT NULL,
  sort_order integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text NOT NULL,
  dimensions text,
  is_published boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. INDEXES & PERFORMANCE OPTIMIZATIONS
CREATE INDEX IF NOT EXISTS products_applications_idx ON public.products USING gin (applications);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- 5. ADMIN AUTHENTICATION DEFINE FUNCTION
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. SECURITY RLS POLICIES

-- Admin Users
DROP POLICY IF EXISTS "Allow read for self on admin_users" ON public.admin_users;
CREATE POLICY "Allow read for self on admin_users" ON public.admin_users
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin full access on admin_users" ON public.admin_users;
CREATE POLICY "Admin full access on admin_users" ON public.admin_users
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Categories
DROP POLICY IF EXISTS "Public SELECT published categories" ON public.categories;
CREATE POLICY "Public SELECT published categories" ON public.categories
  FOR SELECT TO public USING (is_published = true);

DROP POLICY IF EXISTS "Admin full access on categories" ON public.categories;
CREATE POLICY "Admin full access on categories" ON public.categories
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Products
DROP POLICY IF EXISTS "Public SELECT published products" ON public.products;
CREATE POLICY "Public SELECT published products" ON public.products
  FOR SELECT TO public USING (is_published = true);

DROP POLICY IF EXISTS "Admin full access on products" ON public.products;
CREATE POLICY "Admin full access on products" ON public.products
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Projects
DROP POLICY IF EXISTS "Public SELECT published projects" ON public.projects;
CREATE POLICY "Public SELECT published projects" ON public.projects
  FOR SELECT TO public USING (is_published = true);

DROP POLICY IF EXISTS "Admin full access on projects" ON public.projects;
CREATE POLICY "Admin full access on projects" ON public.projects
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Testimonials
DROP POLICY IF EXISTS "Public SELECT published testimonials" ON public.testimonials;
CREATE POLICY "Public SELECT published testimonials" ON public.testimonials
  FOR SELECT TO public USING (is_published = true);

DROP POLICY IF EXISTS "Admin full access on testimonials" ON public.testimonials;
CREATE POLICY "Admin full access on testimonials" ON public.testimonials
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Blog Posts
DROP POLICY IF EXISTS "Public SELECT published blog_posts" ON public.blog_posts;
CREATE POLICY "Public SELECT published blog_posts" ON public.blog_posts
  FOR SELECT TO public USING (is_published = true);

DROP POLICY IF EXISTS "Admin full access on blog_posts" ON public.blog_posts;
CREATE POLICY "Admin full access on blog_posts" ON public.blog_posts
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Enquiries
DROP POLICY IF EXISTS "Public INSERT enquiries" ON public.enquiries;
CREATE POLICY "Public INSERT enquiries" ON public.enquiries
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access on enquiries" ON public.enquiries;
CREATE POLICY "Admin full access on enquiries" ON public.enquiries
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Site Settings
DROP POLICY IF EXISTS "Public SELECT site_settings" ON public.site_settings;
CREATE POLICY "Public SELECT site_settings" ON public.site_settings
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admin full access on site_settings" ON public.site_settings;
CREATE POLICY "Admin full access on site_settings" ON public.site_settings
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Team Members
DROP POLICY IF EXISTS "Public SELECT published team_members" ON public.team_members;
CREATE POLICY "Public SELECT published team_members" ON public.team_members
  FOR SELECT TO public USING (is_published = true);

DROP POLICY IF EXISTS "Admin full access on team_members" ON public.team_members;
CREATE POLICY "Admin full access on team_members" ON public.team_members
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Gallery Items
DROP POLICY IF EXISTS "Public SELECT published gallery_items" ON public.gallery_items;
CREATE POLICY "Public SELECT published gallery_items" ON public.gallery_items
  FOR SELECT TO public USING (is_published = true);

DROP POLICY IF EXISTS "Admin full access on gallery_items" ON public.gallery_items;
CREATE POLICY "Admin full access on gallery_items" ON public.gallery_items
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 7. SEED SITE INITIAL SETTINGS CONFIGURATION
INSERT INTO public.site_settings (key, value)
VALUES 
(
  'brand_settings',
  '{
    "name": "Arihant Marbles and Granite jodhpur ( A unit of New Art and Craft )",
    "short_name": "Arihant Marbles & Granite",
    "whatsapp_number": "+91 93529 95442",
    "contact_phone": "+91 93529 95442",
    "contact_email": "info@arihantmarbles.com",
    "showroom_address": "Opp. Krishi Mandi, Basni, Jodhpur, Rajasthan, India",
    "processing_address": "Industrial Area, Phase 2, Kishangarh, Rajasthan, India",
    "hours": "Mon - Sat: 9:00 AM - 7:00 PM\nSunday: Closed",
    "instagram_url": "https://instagram.com/arihantmarbles",
    "linkedin_url": "https://linkedin.com/company/arihantmarbles"
  }'::jsonb
),
(
  'seo_settings',
  '{
    "title": "Arihant Marbles and Granite - Premium Natural Stone Jodhpur",
    "description": "Sourced from Jodhpur, Rajasthan. Explore our exquisite collection of Italian Marbles, Quartzite, Indian Marbles, and Granite slabs.",
    "keywords": ["Arihant Marbles", "Granite Jodhpur", "Marble Basni", "Italian Marble Jodhpur", "New Art and Craft"],
    "site_url": "https://arihantmarbles.com",
    "allow_indexing": true
  }'::jsonb
),
(
  'home_hero_slides',
  '[
    {"title": "The Art of Natural Luxury", "subtitle": "Discover exquisite collections of Italian marbles and premium Jodhpur granites refined for legacy spaces."},
    {"title": "Crafted by Geologic Time", "subtitle": "Bespoke stone surfaces designed to bring timeless architectural elegance to your countertops and facades."},
    {"title": "Impeccable Craftsmanship", "subtitle": "Jodhpur finest granite processing units delivering globally certified architectural finishes."}
  ]'::jsonb
),
(
  'home_stats_grid',
  '[
    {"value": "25+", "label": "Years Sourcing Legacy"},
    {"value": "150+", "label": "Exotic Stone Variations"},
    {"value": "10k+", "label": "Completed Projects"},
    {"value": "100%", "label": "Rajasthan Craftsmanship"}
  ]'::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;


-- 8. SEED BASE CONFIGURATIONS FOR CATEGORIES
INSERT INTO public.categories (id, name, slug, description, colours, image_url, is_published)
VALUES 
  ('c1f3b145-22d7-4f67-8cfb-6f8d22dfb101', 'Italian Marbles', 'italian-marbles', 'Premium imported Italian marble slabs featuring elegant natural veining.', ARRAY['White', 'Beige', 'Grey', 'Gold'], 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600', true),
  ('c2f3b145-22d7-4f67-8cfb-6f8d22dfb102', 'Indian Granites', 'indian-granites', 'Heavy-duty natural Jodhpur granites and architectural quartzite slabs.', ARRAY['Black', 'Grey', 'Pink', 'White'], 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600', true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  slug = EXCLUDED.slug, 
  colours = EXCLUDED.colours, 
  image_url = EXCLUDED.image_url;


-- 9. SEED INITIAL PRODUCTS
INSERT INTO public.products (id, name, slug, category_id, colour, finish, thickness_options, image_urls, stock_status, is_featured, is_new_arrival, is_published, applications)
VALUES
  (
    'p1f3b145-22d7-4f67-8cfb-6f8d22dfb201', 
    'Calacatta Oro', 
    'calacatta-oro-slabs', 
    'c1f3b145-22d7-4f67-8cfb-6f8d22dfb101', 
    'White', 
    'Polished', 
    ARRAY['18mm', '20mm'], 
    ARRAY['https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600'], 
    'in_stock', 
    true, 
    true, 
    true, 
    ARRAY['Flooring', 'Countertops', 'Cladding']
  ),
  (
    'p2f3b145-22d7-4f67-8cfb-6f8d22dfb202', 
    'Jodhpur Black Granite', 
    'jodhpur-black-granite', 
    'c2f3b145-22d7-4f67-8cfb-6f8d22dfb102', 
    'Black', 
    'Leathered', 
    ARRAY['20mm', '30mm'], 
    ARRAY['https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600'], 
    'in_stock', 
    true, 
    false, 
    true, 
    ARRAY['Kitchen Island', 'Exterior Facades', 'Flooring']
  )
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  slug = EXCLUDED.slug, 
  colour = EXCLUDED.colour, 
  finish = EXCLUDED.finish, 
  thickness_options = EXCLUDED.thickness_options,
  image_urls = EXCLUDED.image_urls,
  applications = EXCLUDED.applications;


-- 10. SEED INITIAL TEAM MEMBERS
INSERT INTO public.team_members (id, name, title, bio, image_url, is_published, sort_order)
VALUES 
  ('t1f3b145-22d7-4f67-8cfb-6f8d22dfb301', 'Anil Mehta', 'Founder & Director', 'Geologist with 30 years of expertise in stone block extraction and block sizing.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300', true, 1),
  ('t2f3b145-22d7-4f67-8cfb-6f8d22dfb302', 'Siddharth Mehta', 'Director of Sales', 'Oversees block sourcing, international client relations, and quality checking operations.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300', true, 2)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  title = EXCLUDED.title, 
  bio = EXCLUDED.bio, 
  image_url = EXCLUDED.image_url;


-- 11. SEED INITIAL GALLERY ITEMS
INSERT INTO public.gallery_items (id, title, description, image_url, category, dimensions, is_published)
VALUES 
  ('g1f3b145-22d7-4f67-8cfb-6f8d22dfb401', 'Italian Arabescato Slab Selection', 'Exotic white slab with deep grey veining.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600', 'Italian Marble', '3000 x 1800 mm', true),
  ('g2f3b145-22d7-4f67-8cfb-6f8d22dfb402', 'Jodhpur Desert Quartzite Facade', 'Golden textured quartzite slab display.', 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600', 'Granite & Quartzite', '2800 x 1600 mm', true)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title, 
  description = EXCLUDED.description, 
  image_url = EXCLUDED.image_url;


-- 12. CREATE INITIAL REBRANDED ADMIN USER
-- Rebrands admin login to admin@arihantmarbles.com with a secure password: 'ArihantAdmin@2026'
DO $$
DECLARE
  new_admin_id uuid := 'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801';
  admin_email text := 'admin@arihantmarbles.com';
BEGIN
  -- Insert into auth.users if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      role,
      aud,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      new_admin_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      admin_email,
      crypt('ArihantAdmin@2026', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin"}',
      FALSE,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Create corresponding identity record
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      new_admin_id,
      new_admin_id,
      admin_email,
      jsonb_build_object('sub', new_admin_id, 'email', admin_email, 'email_verified', true, 'phone_verified', false),
      'email',
      NOW(),
      NOW(),
      NOW()
    );

    -- Add to public.admin_users list
    INSERT INTO public.admin_users (id, email)
    VALUES (new_admin_id, admin_email)
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
  END IF;
END $$;


-- 13. CONFIGURE STORAGE BUCKETS (Registers slabs and catalogue buckets)
INSERT INTO storage.buckets (id, name, public)
VALUES ('slabs', 'slabs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('catalogue', 'catalogue', true)
ON CONFLICT (id) DO UPDATE SET public = true;
