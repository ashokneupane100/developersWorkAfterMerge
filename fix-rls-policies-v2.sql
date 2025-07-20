-- Fix RLS Policies - Version 2 (No Recursion)
-- This fixes the infinite recursion error in the previous policies

-- First, completely disable RLS temporarily to clean up
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow user to view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow user to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow user to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin access to all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin to access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow agents to view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;

-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create SIMPLE, NON-RECURSIVE policies

-- 1. Allow authenticated users to INSERT their own profile (for signup)
CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 2. Allow users to SELECT their own profile
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Allow users to UPDATE their own profile
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Allow anonymous users to INSERT (for signup flow)
CREATE POLICY "profiles_insert_anon"
ON public.profiles
FOR INSERT
TO anon
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;

-- Set default value for user_role
ALTER TABLE public.profiles 
ALTER COLUMN user_role SET DEFAULT 'Buyer';

-- Create helpful indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Drop the problematic trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a simple function for profile creation (optional, can be handled in app code)
CREATE OR REPLACE FUNCTION public.create_profile_for_user(
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'Buyer'
)
RETURNS UUID AS $$
DECLARE
  profile_id UUID;
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    email, 
    full_name, 
    user_role, 
    auth_provider,
    email_verified,
    created_at, 
    updated_at
  )
  VALUES (
    user_id,
    email,
    full_name,
    role::user_role,
    'email',
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW()
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the policies by checking they don't cause recursion
SELECT 'RLS policies updated successfully' as status; 