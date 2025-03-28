/*
  # Correction du schéma de base de données

  1. Changements
    - Suppression sécurisée des types et tables s'ils existent déjà
    - Recréation propre du schéma
    - Ajout de vérifications d'existence pour éviter les erreurs

  2. Sécurité
    - Utilisation de blocs DO pour gérer les suppressions de manière sécurisée
    - Maintien des politiques RLS
*/

-- Suppression sécurisée des types enum s'ils existent
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        DROP TYPE user_role CASCADE;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        DROP TYPE booking_status CASCADE;
    END IF;
END $$;

-- Suppression sécurisée des tables si elles existent
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS availabilities CASCADE;
DROP TABLE IF EXISTS children CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Création des types enum
CREATE TYPE user_role AS ENUM ('parent', 'nounou', 'gestionnaire');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Table des profils utilisateurs
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Table des enfants
CREATE TABLE children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  birth_date date NOT NULL,
  allergies text[] DEFAULT '{}',
  special_needs text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des disponibilités
CREATE TABLE availabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nounou_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (start_time < end_time)
);

-- Table des réservations
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  nounou_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (start_time < end_time)
);

-- Activation de la sécurité RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE availabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour profiles
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Les utilisateurs peuvent voir leur propre profil" ON profiles;
    DROP POLICY IF EXISTS "Les nounous peuvent voir les profils des parents" ON profiles;
    DROP POLICY IF EXISTS "Les parents peuvent voir les profils des nounous" ON profiles;
    DROP POLICY IF EXISTS "Les gestionnaires peuvent voir tous les profils" ON profiles;
    DROP POLICY IF EXISTS "Les utilisateurs peuvent modifier leur propre profil" ON profiles;
END $$;

CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Les nounous peuvent voir les profils des parents"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'nounou'
    AND role = 'parent'
  );

CREATE POLICY "Les parents peuvent voir les profils des nounous"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'parent'
    AND role = 'nounou'
  );

CREATE POLICY "Les gestionnaires peuvent voir tous les profils"
  ON profiles FOR SELECT
  TO authenticated
  USING ((SELECT role FROM profiles WHERE user_id = auth.uid()) = 'gestionnaire');

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour children
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Les parents peuvent gérer leurs enfants" ON children;
    DROP POLICY IF EXISTS "Les nounous peuvent voir les enfants de leurs réservations" ON children;
END $$;

CREATE POLICY "Les parents peuvent gérer leurs enfants"
  ON children FOR ALL
  TO authenticated
  USING (
    parent_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'parent'
    )
  );

CREATE POLICY "Les nounous peuvent voir les enfants de leurs réservations"
  ON children FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN profiles p ON p.id = b.nounou_id
      WHERE b.child_id = children.id
      AND p.user_id = auth.uid()
      AND p.role = 'nounou'
    )
  );

-- Politiques RLS pour availabilities
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Les nounous peuvent gérer leurs disponibilités" ON availabilities;
    DROP POLICY IF EXISTS "Les parents peuvent voir les disponibilités des nounous" ON availabilities;
END $$;

CREATE POLICY "Les nounous peuvent gérer leurs disponibilités"
  ON availabilities FOR ALL
  TO authenticated
  USING (
    nounou_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'nounou'
    )
  );

CREATE POLICY "Les parents peuvent voir les disponibilités des nounous"
  ON availabilities FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid()
      AND role = 'parent'
    )
  );

-- Politiques RLS pour bookings
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Les parents peuvent voir et gérer leurs réservations" ON bookings;
    DROP POLICY IF EXISTS "Les nounous peuvent voir et gérer leurs réservations" ON bookings;
END $$;

CREATE POLICY "Les parents peuvent voir et gérer leurs réservations"
  ON bookings FOR ALL
  TO authenticated
  USING (
    parent_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'parent'
    )
  );

CREATE POLICY "Les nounous peuvent voir et gérer leurs réservations"
  ON bookings FOR ALL
  TO authenticated
  USING (
    nounou_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid() AND role = 'nounou'
    )
  );

-- Suppression et recréation des triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_children_updated_at ON children;
DROP TRIGGER IF EXISTS update_availabilities_updated_at ON availabilities;
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_availabilities_updated_at
  BEFORE UPDATE ON availabilities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Création des profils pour les utilisateurs de test
INSERT INTO profiles (user_id, role, first_name, last_name)
SELECT 
  id as user_id,
  (raw_user_meta_data->>'role')::user_role as role,
  raw_user_meta_data->>'firstName' as first_name,
  raw_user_meta_data->>'lastName' as last_name
FROM auth.users
WHERE email IN ('parent@test.com', 'nounou@test.com', 'gestionnaire@test.com')
ON CONFLICT (user_id) DO NOTHING;