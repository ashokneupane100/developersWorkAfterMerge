-- Update OAuth Profile Creation for Google/Facebook Sign-in
-- Run this script in your Supabase SQL editor

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle OAuth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_full_name TEXT;
  user_email TEXT;
  auth_provider TEXT;
  avatar_url TEXT;
BEGIN
  -- Extract user information from metadata
  user_email := COALESCE(NEW.email, '');
  
  -- Handle different OAuth providers
  IF NEW.raw_app_meta_data->>'provider' = 'google' THEN
    auth_provider := 'google';
    user_full_name := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(user_email, '@', 1)
    );
    avatar_url := COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    );
  ELSIF NEW.raw_app_meta_data->>'provider' = 'facebook' THEN
    auth_provider := 'facebook';
    user_full_name := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(user_email, '@', 1)
    );
    avatar_url := COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    );
  ELSE
    -- Default for email signup
    auth_provider := 'email';
    user_full_name := COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      split_part(user_email, '@', 1)
    );
    avatar_url := NULL;
  END IF;

  -- Insert profile with proper data
  INSERT INTO public.profiles (
    user_id, 
    full_name, 
    email, 
    user_role, 
    auth_provider, 
    avatar_url,
    email_verified,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    user_full_name,
    user_email,
    'Buyer',
    auth_provider,
    avatar_url,
    CASE WHEN auth_provider IN ('google', 'facebook') THEN true ELSE false END,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    auth_provider = EXCLUDED.auth_provider,
    avatar_url = EXCLUDED.avatar_url,
    email_verified = EXCLUDED.email_verified,
    updated_at = NOW();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically handle profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create profiles for existing OAuth users who don't have profiles
INSERT INTO public.profiles (
  user_id,
  full_name,
  email,
  user_role,
  auth_provider,
  avatar_url,
  email_verified,
  created_at,
  updated_at
)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ) as full_name,
  u.email,
  'Buyer' as user_role,
  COALESCE(u.raw_app_meta_data->>'provider', 'email') as auth_provider,
  COALESCE(
    u.raw_user_meta_data->>'avatar_url',
    u.raw_user_meta_data->>'picture'
  ) as avatar_url,
  CASE WHEN u.raw_app_meta_data->>'provider' IN ('google', 'facebook') THEN true ELSE false END as email_verified,
  u.created_at,
  NOW() as updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
WHERE p.user_id IS NULL
  AND u.email IS NOT NULL
  AND u.raw_app_meta_data->>'provider' IN ('google', 'facebook');

-- Verify the trigger is working
SELECT 'OAuth profile creation updated successfully!' as status; 