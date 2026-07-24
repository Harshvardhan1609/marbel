-- ============================================================
-- SUDHIR MARBELS — ADMIN USER SETUP (Run in Supabase SQL Editor)
-- This script properly creates the admin user with auth.identities
-- ============================================================

-- Step 1: Remove any broken existing record (no identities)
DELETE FROM auth.identities WHERE user_id = 'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801';
DELETE FROM public.admin_users WHERE id = 'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801';
DELETE FROM auth.users WHERE id = 'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801';

-- Also clean up by email in case there are duplicates with different UUIDs
DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@sudhirmarbels.com');
DELETE FROM public.admin_users WHERE email = 'admin@sudhirmarbels.com';
DELETE FROM auth.users WHERE email = 'admin@sudhirmarbels.com';

-- Step 2: Create the admin user in auth.users with correct bcrypt hash
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
  'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@sudhirmarbels.com',
  crypt('SudhirAdmin@2024', gen_salt('bf')),
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

-- Step 3: Create the required auth.identities record (THIS IS WHAT WAS MISSING)
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
  'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801',
  'a8f3b145-22d7-4f67-8cfb-6f8d22dfb801',
  'admin@sudhirmarbels.com',
  '{"sub":"a8f3b145-22d7-4f67-8cfb-6f8d22dfb801","email":"admin@sudhirmarbels.com","email_verified":true,"phone_verified":false}',
  'email',
  NOW(),
  NOW(),
  NOW()
);

-- Step 4: Register in public.admin_users
INSERT INTO public.admin_users (id, email)
VALUES ('a8f3b145-22d7-4f67-8cfb-6f8d22dfb801', 'admin@sudhirmarbels.com')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Verify everything
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL AS email_confirmed,
  i.provider,
  i.provider_id,
  au.email AS in_admin_users
FROM auth.users u
LEFT JOIN auth.identities i ON i.user_id = u.id
LEFT JOIN public.admin_users au ON au.id = u.id
WHERE u.email = 'admin@sudhirmarbels.com';
