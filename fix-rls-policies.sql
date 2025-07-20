-- Fix RLS Policies for Profiles Table with new user_role enum
-- This script addresses the RLS violation error after changing user_role from boolean to enum

-- First, let's drop all existing RLS policies on profiles table
DROP POLICY IF EXISTS "Allow user to view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow user to update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow user to insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow admin access to all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;

-- Ensure RLS is enabled on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create new RLS policies that work with the enum structure

-- 1. Allow users to INSERT their own profile (needed for signup)
CREATE POLICY "Allow users to insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 2. Allow users to SELECT their own profile
CREATE POLICY "Allow users to view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Allow users to UPDATE their own profile
CREATE POLICY "Allow users to update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Allow Admin users to access all profiles
CREATE POLICY "Allow admin to access all profiles"
ON public.profiles
FOR ALL
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.profiles 
    WHERE user_role = 'Admin' 
    AND user_id = auth.uid()
  )
);

-- 5. Allow Agent users to view profiles (for property management)
CREATE POLICY "Allow agents to view profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM public.profiles 
    WHERE user_role IN ('Admin', 'Agent') 
    AND user_id = auth.uid()
  )
  OR auth.uid() = user_id
);

-- 6. Allow public read access for basic profile info (optional - comment out if not needed)
-- CREATE POLICY "Allow public read access for basic profile info"
-- ON public.profiles
-- FOR SELECT
-- USING (true);

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO anon;

-- Make sure the user_role enum has all required values
-- (This should already exist from your schema)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('Admin', 'Agent', 'Buyer');
    END IF;
END $$;

-- Set default value for user_role in profiles table
ALTER TABLE public.profiles 
ALTER COLUMN user_role SET DEFAULT 'Buyer';

-- Create index for better performance on user_role queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Function to automatically create profile after user signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, user_role, auth_provider, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    'Buyer',
    'email',
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = NEW.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically handle profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema'; 