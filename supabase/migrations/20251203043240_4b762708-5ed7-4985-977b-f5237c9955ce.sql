-- Add client_code column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS client_code TEXT UNIQUE;

-- Create function to generate next client code
CREATE OR REPLACE FUNCTION public.generate_client_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  new_code TEXT;
BEGIN
  -- Get the highest existing client code number
  SELECT COALESCE(MAX(CAST(SUBSTRING(client_code FROM 3) AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.profiles
  WHERE client_code IS NOT NULL AND client_code ~ '^DB[0-9]+$';
  
  -- Format as DB01, DB02, etc.
  new_code := 'DB' || LPAD(next_num::TEXT, 2, '0');
  
  RETURN new_code;
END;
$$;

-- Update handle_new_user to auto-assign client_code for clients
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_client_code TEXT;
BEGIN
  -- Generate client code
  new_client_code := public.generate_client_code();
  
  INSERT INTO public.profiles (id, email, full_name, client_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    new_client_code
  );
  
  -- Assign default client role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client');
  
  RETURN NEW;
END;
$$;

-- Assign client codes to existing users who don't have one
DO $$
DECLARE
  profile_record RECORD;
  next_code TEXT;
BEGIN
  FOR profile_record IN 
    SELECT id FROM public.profiles WHERE client_code IS NULL ORDER BY created_at
  LOOP
    next_code := public.generate_client_code();
    UPDATE public.profiles SET client_code = next_code WHERE id = profile_record.id;
  END LOOP;
END;
$$;