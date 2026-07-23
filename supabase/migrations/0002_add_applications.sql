-- Migration: Add applications array column to products table for advanced filtering
alter table public.products 
add column if not exists applications text[] default '{}'::text[] not null;

-- Add an index for array search optimizations (GIN index)
create index if not exists products_applications_idx on public.products using gin (applications);
