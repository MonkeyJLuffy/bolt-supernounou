/*
  # Schéma initial de Super Nounou

  1. Nouvelles Tables
    - `profiles` : Informations détaillées des utilisateurs
      - `id` (uuid, clé primaire)
      - `user_id` (uuid, lié à auth.users)
      - `role` (enum)
      - `first_name` (text)
      - `last_name` (text)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `children` : Informations sur les enfants
      - `id` (uuid, clé primaire)
      - `parent_id` (uuid, lié à profiles)
      - `first_name` (text)
      - `last_name` (text)
      - `birth_date` (date)
      - `allergies` (text[])
      - `special_needs` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `availabilities` : Disponibilités des nounous
      - `id` (uuid, clé primaire)
      - `nounou_id` (uuid, lié à profiles)
      - `day_of_week` (int, 0-6)
      - `start_time` (time)
      - `end_time` (time)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `bookings` : Réservations de garde
      - `id` (uuid, clé primaire)
      - `parent_id` (uuid, lié à profiles)
      - `nounou_id` (uuid, lié à profiles)
      - `child_id` (uuid, lié à children)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `status` (enum)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Types Enum
    - `user_role` : Rôles des utilisateurs
    - `booking_status` : États des réservations

  3. Sécurité
    - RLS activé sur toutes les tables
    - Politiques d'accès basées sur les rôles
*/

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

-- Triggers pour updated_at
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
WHERE email IN ('parent@test.com', 'nounou@test.com', 'gestionnaire@test.com');