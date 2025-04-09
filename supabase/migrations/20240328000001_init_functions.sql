-- Fonction pour créer la table profiles
CREATE OR REPLACE FUNCTION create_profiles_table()
RETURNS void AS $$
BEGIN
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

  -- Enable RLS
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

  -- Service role policy
  CREATE POLICY "Service role can manage all profiles"
    ON public.profiles
    TO service_role
    USING (true)
    WITH CHECK (true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer la table children
CREATE OR REPLACE FUNCTION create_children_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.children (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    birth_date date NOT NULL,
    photo_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Enable RLS
  ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

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

  -- Service role policy
  CREATE POLICY "Service role can manage all children"
    ON public.children
    TO service_role
    USING (true)
    WITH CHECK (true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer la table parent_children
CREATE OR REPLACE FUNCTION create_parent_children_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.parent_children (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    child_id uuid REFERENCES public.children(id) ON DELETE CASCADE,
    is_primary_parent boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    UNIQUE(parent_id, child_id)
  );

  -- Enable RLS
  ALTER TABLE public.parent_children ENABLE ROW LEVEL SECURITY;

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

  -- Service role policy
  CREATE POLICY "Service role can manage all parent_children"
    ON public.parent_children
    TO service_role
    USING (true)
    WITH CHECK (true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer la table parent_couples
CREATE OR REPLACE FUNCTION create_parent_couples_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.parent_couples (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent1_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent2_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(parent1_id, parent2_id)
  );

  -- Enable RLS
  ALTER TABLE public.parent_couples ENABLE ROW LEVEL SECURITY;

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

  -- Service role policy
  CREATE POLICY "Service role can manage all parent_couples"
    ON public.parent_couples
    TO service_role
    USING (true)
    WITH CHECK (true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour créer l'utilisateur admin par défaut
CREATE OR REPLACE FUNCTION create_default_admin()
RETURNS void AS $$
BEGIN
  -- Créer l'utilisateur admin dans auth.users
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
  )
  ON CONFLICT (email) DO NOTHING;

  -- Créer le profil admin dans public.profiles
  INSERT INTO public.profiles (
    id,
    email,
    role,
    first_name,
    last_name,
    is_approved
  )
  SELECT 
    id,
    email,
    'admin',
    'Admin',
    'System',
    true
  FROM auth.users
  WHERE email = 'admin@supernounou.fr'
  ON CONFLICT (email) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 