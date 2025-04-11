-- Activer l'extension pgcrypto pour le hachage des mots de passe
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Créer la table users si elle n'existe pas
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_role CHECK (role IN ('admin', 'gestionnaire', 'nounou', 'parent'))
);

-- Créer l'utilisateur admin s'il n'existe pas
INSERT INTO users (
  email,
  password_hash,
  role,
  first_name,
  last_name,
  is_active
) VALUES (
  'admin@supernounou.fr',
  crypt('SuperNounouPassword', gen_salt('bf')),
  'admin',
  'Admin',
  'System',
  true
) ON CONFLICT (email) DO NOTHING; 