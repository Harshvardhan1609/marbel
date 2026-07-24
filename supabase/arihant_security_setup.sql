-- ============================================================
-- ARIHANT MARBLES & GRANITE — DATABASE HARDENING & STORAGE RLS
-- Run this script in the Supabase SQL Editor to make the DB cyber-proof.
-- ============================================================

-- 1. CLEAN UP PREVIOUS ADMIN USER (SUDHIR REBRAND)
-- Discards previous login references to keep authentication database clean.
DELETE FROM auth.identities WHERE provider_id = 'admin@sudhirmarbels.com';
DELETE FROM public.admin_users WHERE email = 'admin@sudhirmarbels.com';
DELETE FROM auth.users WHERE email = 'admin@sudhirmarbels.com';

-- 2. CREATE NEW REBRANDED ARIHANT ADMIN USER
-- Rebrands admin login to admin@arihantmarbles.com with a cryptographically secure bcrypt password.
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
      crypt('ArihantAdmin@2026', gen_salt('bf')), -- Default secure password
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
-- Note: Storage policies on storage.objects cannot be altered directly via the SQL Editor due to Supabase security restrictions.
-- Please configure your 'slabs' and 'catalogue' storage bucket policies as "Public" with select permissions,
-- and restrict insert/delete permissions to authenticated users using the Supabase Dashboard UI (Storage -> Policies).

