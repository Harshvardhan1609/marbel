-- 1. Create team_members table
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text not null,
  bio text,
  image_url text,
  order_index integer default 0,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create gallery_items table
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,
  category text not null,
  order_index integer default 0,
  is_published boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Alter categories table to support images and colours
alter table public.categories add column if not exists image_url text;
alter table public.categories add column if not exists colours text[] default '{}'::text[] not null;

-- 4. Enable Row Level Security (RLS)
alter table public.team_members enable row level security;
alter table public.gallery_items enable row level security;

-- 5. Create RLS Policies
-- Team Members policies
drop policy if exists "Public SELECT published team_members" on public.team_members;
create policy "Public SELECT published team_members" on public.team_members
  for select to public using (is_published = true);

drop policy if exists "Admin full access on team_members" on public.team_members;
create policy "Admin full access on team_members" on public.team_members
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Gallery Items policies
drop policy if exists "Public SELECT published gallery_items" on public.gallery_items;
create policy "Public SELECT published gallery_items" on public.gallery_items
  for select to public using (is_published = true);

drop policy if exists "Admin full access on gallery_items" on public.gallery_items;
create policy "Admin full access on gallery_items" on public.gallery_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- SEED INITIAL CONFIGURATIONS AND STATIC CONTENT
-- ============================================================

-- Seed Default Brand Settings
insert into public.site_settings (key, value)
values (
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
    "linkedin_url": "https://linkedin.com/company/arihantmarbles",
    "about_story_title": "Two Decades of Curating Nature''s Masterpieces",
    "about_story_p1": "Founded with a passion for architectural stone curation, Arihant Marbles and Granite has evolved from a local trading office into one of Jodhpur''s and Kishangarh''s premier processing plants. We believe that stone is not just a building material, but a permanent canvas of Earth''s historical art.",
    "about_story_p2": "Our teams consult directly with architects, builders, and structural designers globally, matching stone densities and aesthetic veining options to bespoke layouts."
  }'::jsonb
) on conflict (key) do update set value = excluded.value;

-- Seed Default SEO Settings
insert into public.site_settings (key, value)
values (
  'seo_settings',
  '{
    "title": "Arihant Marbles & Granite — Premium Marble & Granite Curator",
    "description": "Exquisite natural stone collections, marble, granite, and luxury stone processing for bespoke architectural projects in Jodhpur.",
    "keywords": ["Marble", "Granite", "Natural Stone", "Luxury Interiors", "Stone Trading", "Arihant Marbles", "Jodhpur"],
    "allow_indexing": true,
    "site_url": "https://arihantmarbles.com"
  }'::jsonb
) on conflict (key) do update set value = excluded.value;

-- Seed default Category details (images and colors)
update public.categories set 
  image_url = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600',
  colours = ARRAY['White', 'Beige', 'Grey']
where slug = 'italian-marbles';

update public.categories set 
  image_url = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600',
  colours = ARRAY['Black', 'Grey', 'Pink']
where slug = 'indian-granites';

update public.categories set 
  image_url = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600',
  colours = ARRAY['Green', 'White', 'Gold']
where slug = 'quartzite';

update public.categories set 
  image_url = 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600',
  colours = ARRAY['Pink', 'White', 'Beige']
where slug = 'onyx';

update public.categories set 
  image_url = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=600',
  colours = ARRAY['Beige', 'White']
where slug = 'travertine';

update public.categories set 
  image_url = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600',
  colours = ARRAY['Beige', 'Grey']
where slug = 'limestone';

update public.categories set 
  image_url = 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=600',
  colours = ARRAY['White', 'Black', 'Grey']
where slug = 'quartz';

update public.categories set 
  image_url = 'https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?q=80&w=600',
  colours = ARRAY['Mixed', 'Beige']
where slug = 'stone-tiles';

-- Seed initial Team Members (Leadership)
insert into public.team_members (name, title, bio, image_url, order_index, is_published) values
  ('Arihant Jain', 'Managing Director & Founder', 'Over 20 years of expertise in natural stone curation and global quarry acquisitions, bringing fine stone to Indian architecture.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400', 1, true),
  ('Rahul Jain', 'Head of Global Sourcing', 'Spearheads quality inspections across Italy, Greece, and Brazil to select premium blocks matching international design standards.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400', 2, true),
  ('Amit Sharma', 'Principal Stone Curator', 'Advises luxury architects and project builders on stone structural soundness, bookmatch layouts, and aesthetic detailing.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400', 3, true)
on conflict do nothing;

-- Seed initial Gallery Items
insert into public.gallery_items (title, description, image_url, category, order_index, is_published) values
  ('Pristine White Carrara', 'Classic Italian Carrara marble slab showing signature soft grey veining detail.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=600', 'Italian Marbles', 1, true),
  ('Luminous Emerald Quartzite', 'Stunning translucent quartzite slabs highlighting rich green crystalline veining.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600', 'Exotic Quartzite', 2, true),
  ('Arabescato Onyx Highlight', 'Backlit onyx slab swirling with organic lines of pink and warm translucent amber.', 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600', 'Luminous Onyx', 3, true),
  ('Bespoke Living Room Flooring', 'Bookmatched Italian marble layout completed for a luxury penthouse residence in Jaipur.', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=600', 'Installations', 4, true),
  ('Block Curation Inspection', 'Inspectors hand-selecting premium raw stone blocks direct at the processing plant yard.', 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600', 'Processing', 5, true)
on conflict do nothing;

