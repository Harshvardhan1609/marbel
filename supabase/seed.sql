-- Seeding script for Sudhir Marbels initial database state

-- Enable pgcrypto extension for auth password encryption
create extension if not exists pgcrypto;

-- ============================================================
-- ADMIN USER SETUP
-- Cleans any broken records then creates with full auth.identities
-- ============================================================

-- Clean up any broken existing records (raw SQL inserts miss auth.identities)
delete from auth.identities where user_id = 'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801';
delete from public.admin_users where id = 'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801';
delete from auth.users where id = 'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801';

-- Also clean by email in case of duplicates
delete from auth.identities where user_id in (select id from auth.users where email = 'admin@sudhirmarbels.com');
delete from public.admin_users where email = 'admin@sudhirmarbels.com';
delete from auth.users where email = 'admin@sudhirmarbels.com';

-- Create admin user in auth.users
insert into auth.users (
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
) values (
  'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@sudhirmarbels.com',
  crypt('SudhirAdmin@2024', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  false,
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Create auth.identities record (REQUIRED for signInWithPassword to work)
insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) values (
  'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801',
  'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801',
  'admin@sudhirmarbels.com',
  '{"sub":"a8f3b145-22d7-4f67-8cfb-6f8d22dfb801","email":"admin@sudhirmarbels.com","email_verified":true,"phone_verified":false}',
  'email',
  now(),
  now(),
  now()
);

-- Register user in public.admin_users
insert into public.admin_users (id, email) values
  ('a8f3b145-22d7-4f67-8cfb-6f8d22dfb801', 'admin@sudhirmarbels.com')
on conflict (id) do update set email = excluded.email;

-- 1. Insert Categories
insert into public.categories (id, name, slug, description, is_published) values
  ('c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a1', 'Italian Marbles', 'italian-marbles', 'Globally imported premium marbles.', true),
  ('c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a2', 'Indian Granites', 'indian-granites', 'High-durability Indian granite blocks.', true),
  ('c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a3', 'Exotic Quartzite', 'quartzite', 'Translucent crystalline exotic quartzites.', true),
  ('c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a4', 'Luminous Onyx', 'onyx', 'Premium translucent back-lit onyx slabs.', true),
  ('c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a5', 'Classic Travertine', 'travertine', 'Porous, textured travertine stone tiling.', true),
  ('c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a6', 'Serene Limestone', 'limestone', 'Soft textured natural sedimentary limestone.', true),
  ('c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a7', 'Premium Quartz', 'quartz', 'Engineered resin-bonded silica quartz.', true),
  ('c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a8', 'Bespoke Tiles', 'stone-tiles', 'Hand-cut mosaics and dimensional stone tiles.', true)
on conflict (id) do nothing;

-- 2. Insert 12 Products
insert into public.products (id, name, slug, category_id, colour, finish, thickness_options, image_urls, stock_status, is_featured, is_new_arrival, is_published, applications) values
  -- Italian Marbles
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb501', 'Calacatta Oro Marble', 'calacatta-oro-marble', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a1', 'White', 'Polished', '{18mm, 20mm}', '{"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"}', 'in_stock', true, true, true, '{"Flooring", "Wall Cladding", "Countertop"}'),
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb502', 'Bianco Lasa Marble', 'bianco-lasa-marble', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a1', 'White', 'Polished', '{18mm}', '{"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600"}', 'in_stock', false, true, true, '{"Flooring", "Wall Cladding"}'),
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb503', 'Statuario Classico', 'statuario-classico', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a1', 'White', 'Bookmatched', '{18mm, 20mm}', '{"https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600"}', 'limited', true, false, true, '{"Wall Cladding"}'),
  
  -- Indian Granites
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb504', 'Titanium Gold Granite', 'titanium-gold-granite', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a2', 'Black', 'Satin', '{20mm, 30mm}', '{"https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600"}', 'in_stock', true, false, true, '{"Flooring", "Countertop", "Parking"}'),
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb505', 'Black Galaxy Granite', 'black-galaxy-granite', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a2', 'Black', 'Polished', '{20mm}', '{"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"}', 'in_stock', false, false, true, '{"Countertop", "Parking"}'),
  
  -- Exotic Quartzite
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb506', 'Emerald Quartzite', 'emerald-quartzite', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a3', 'Green', 'Leathered', '{20mm}', '{"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"}', 'in_stock', true, true, true, '{"Wall Cladding", "Countertop"}'),
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb507', 'Taj Mahal Quartzite', 'taj-mahal-quartzite', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a3', 'Beige', 'Honed', '{20mm}', '{"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"}', 'limited', false, true, true, '{"Flooring", "Countertop"}'),
  
  -- Luminous Onyx
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb508', 'Arabescato Onyx', 'arabescato-onyx', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a4', 'Pink', 'Bookmatched', '{18mm, 20mm}', '{"https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600"}', 'limited', true, false, true, '{"Wall Cladding"}'),
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb509', 'Honey Onyx Translucent', 'honey-onyx-translucent', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a4', 'Yellow', 'Polished', '{18mm}', '{"https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600"}', 'in_stock', false, true, true, '{"Wall Cladding"}'),
  
  -- Travertine & Limestone
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb510', 'Crema Marfil Travertine', 'crema-marfil-travertine', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a5', 'Beige', 'Honed', '{20mm}', '{"https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600"}', 'sold_out', false, false, true, '{"Flooring", "Parking"}'),
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb511', 'Silver Travertine Slabs', 'silver-travertine-slabs', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a5', 'Grey', 'Leathered', '{20mm, 30mm}', '{"https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600"}', 'in_stock', false, true, true, '{"Wall Cladding", "Flooring"}'),
  ('d8f3b145-22d7-4f67-8cfb-6f8d22dfb512', 'Moca Cream Limestone', 'moca-cream-limestone', 'c8f3b145-22d7-4f67-8cfb-6f8d22dfb4a6', 'Beige', 'Honed', '{20mm}', '{"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600"}', 'in_stock', false, false, true, '{"Wall Cladding"}')
on conflict (id) do nothing;

-- 3. Insert 3 Projects
insert into public.projects (id, title, slug, description, image_urls, location, completion_date, category, stone_products_used, is_published) values
  ('e8f3b145-22d7-4f67-8cfb-6f8d22dfb601', 'The Grandeur Penthouse', 'grandeur-penthouse', 'A luxury private penthouse residence utilizing book-matched Italian marble slabs for wall cladding and premium flooring. Slabs were custom sliced in our Kishangarh facility to ensure precise bookmatching across the 4000 sqft main hall.', '{"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600"}', 'New Delhi, India', '2024-05-12', 'residential', '{"Calacatta Oro Marble", "Bianco Lasa Marble"}', true),
  ('e8f3b145-22d7-4f67-8cfb-6f8d22dfb602', 'Aman Plaza Lobby', 'aman-plaza-lobby', 'Commercial reception lobby featuring custom back-lit emerald quartzite reception counter and book-matched onyx highlights. The translucent layers of onyx allow complete illumination, creating a dramatic luxury entry.', '{"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600"}', 'Mumbai, India', '2023-11-20', 'hospitality', '{"Emerald Quartzite", "Arabescato Onyx"}', true),
  ('e8f3b145-22d7-4f67-8cfb-6f8d22dfb603', 'Oasis Executive Towers', 'oasis-executive-towers', 'Luxury corporate office spaces finished with polished titanium gold granite panels and wall partitions. The dense granite provides a highly resilient, wear-resistant flooring solution for high-traffic executive corridors.', '{"https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600"}', 'Gurgaon, India', '2023-08-15', 'commercial', '{"Titanium Gold Granite"}', true)
on conflict (id) do nothing;

-- 4. Insert 4 Testimonials
insert into public.testimonials (id, author_name, author_title, company, quote, avatar_url, is_published) values
  ('f8f3b145-22d7-4f67-8cfb-6f8d22dfb701', 'Architect Rakesh Sethi', 'Principal Architect', 'Sethi & Partners', 'Sudhir Marbels delivered outstanding bookmatched Calacatta Classico slabs. The precision of the slicing and direct alignment dry-runs in their Kishangarh yard gave our clients total layout confidence.', null, true),
  ('f8f3b145-22d7-4f67-8cfb-6f8d22dfb702', 'Devi Developers', 'Managing Director', 'Devi Infrastructure', 'Their exotic Quartzite is the focal centerpiece of our luxury hotel lobby project. Phenomenal vein structure and impeccable line-polished surfaces.', null, true),
  ('f8f3b145-22d7-4f67-8cfb-6f8d22dfb703', 'Priya Mehra', 'Lead Interior Curator', 'Studio Mehra', 'A true architectural stone curator plant. The custom dimensions match our specifications precisely, and the WhatsApp direct line simplified visual coordination.', null, true),
  ('f8f3b145-22d7-4f67-8cfb-6f8d22dfb704', 'Karan Johar Structures', 'Procurement Officer', 'KJS Contracting', 'Prompt logistics packaging in heavy steel A-frames saved us on shipping breakage. We have sourced over 100,000 sqft of Indian Granites without a single crack.', null, true)
on conflict (id) do nothing;

-- 5. Insert initial site settings
insert into public.site_settings (key, value) values
  ('hero_slides', '[
    {"title": "Timeless Stone. Modern Spaces.", "subtitle": "Exquisite hand-selected marble and granites tailored to your design specifications."},
    {"title": "Geological Craft. Architectural Art.", "subtitle": "Direct-from-source exotics curated from Italian, Brazilian, and Indian quarries."}
  ]'),
  ('stats', '[
    {"value": "20+", "label": "Years Experience"},
    {"value": "150+", "label": "Stone Varieties"},
    {"value": "500+", "label": "Projects Sourced"}
  ]'),
  ('featured_categories_order', '["italian-marbles", "indian-granites", "quartzite", "onyx"]')
on conflict (key) do update set value = excluded.value;
