-- Supprimer la base de données si elle existe
DROP DATABASE IF EXISTS supernounou_test;

-- Créer la base de données de test
CREATE DATABASE supernounou_test;

-- Créer l'extension uuid-ossp si elle n'existe pas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Se connecter à la base de données de test
\c supernounou_test;

-- Créer la table des utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur l'email
CREATE INDEX idx_users_email ON users(email);

-- Créer un index sur le rôle
CREATE INDEX idx_users_role ON users(role); 