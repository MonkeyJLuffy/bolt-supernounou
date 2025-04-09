/*
  # Initialize Database Schema
  
  1. Tables
    - `profiles` (updated)
    - `children` (new)
    - `parent_children` (new)
    - `parent_couples` (new)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add service role policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'parent',
  first_name text,
  last_name text,
  is_approved boolean DEFAULT false,
  must_change_password boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'gestionnaire', 'nounou', 'parent'))
);

-- Create children table
CREATE TABLE IF NOT EXISTS public.children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  birth_date date NOT NULL,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create parent_children table
CREATE TABLE IF NOT EXISTS public.parent_children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id uuid REFERENCES public.children(id) ON DELETE CASCADE,
  is_primary_parent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent_id, child_id)
);

-- Create parent_couples table
CREATE TABLE IF NOT EXISTS public.parent_couples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent1_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent2_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(parent1_id, parent2_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_couples ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Gestionnaires can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'gestionnaire'
    )
  );

CREATE POLICY "Gestionnaires can update approval status"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'gestionnaire'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'gestionnaire'
    )
  );

-- Children policies
CREATE POLICY "Parents can read own children"
  ON public.children
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_children
      WHERE child_id = id AND parent_id = auth.uid()
    )
  );

CREATE POLICY "Parents can create children"
  ON public.children
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Parents can update own children"
  ON public.children
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_children
      WHERE child_id = id AND parent_id = auth.uid()
    )
  );

-- Parent_children policies
CREATE POLICY "Parents can read own parent_children relations"
  ON public.parent_children
  FOR SELECT
  TO authenticated
  USING (parent_id = auth.uid());

CREATE POLICY "Parents can create parent_children relations"
  ON public.parent_children
  FOR INSERT
  TO authenticated
  WITH CHECK (parent_id = auth.uid());

-- Parent_couples policies
CREATE POLICY "Parents can read own couples"
  ON public.parent_couples
  FOR SELECT
  TO authenticated
  USING (parent1_id = auth.uid() OR parent2_id = auth.uid());

CREATE POLICY "Parents can create couples"
  ON public.parent_couples
  FOR INSERT
  TO authenticated
  WITH CHECK (parent1_id = auth.uid() OR parent2_id = auth.uid());

-- Service role policies
CREATE POLICY "Service role can manage all profiles"
  ON public.profiles
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all children"
  ON public.children
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all parent_children"
  ON public.parent_children
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can manage all parent_couples"
  ON public.parent_couples
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, first_name, last_name, is_approved)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent'),
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'parent') = 'admin' THEN true
      ELSE false
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create default admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@supernounou.fr',
  crypt('administrateur', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","firstName":"Admin","lastName":"System"}',
  now(),
  now()
); 