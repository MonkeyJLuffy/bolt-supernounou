/*
  # Fix User Creation

  1. Changes
    - Drop existing test users if they exist
    - Create new test users with proper authentication setup
    - Ensure proper metadata structure

  2. Security
    - Passwords are hashed using bcrypt
    - Email confirmation is set
*/

-- Suppression des utilisateurs de test existants s'ils existent
DELETE FROM auth.users 
WHERE email IN ('parent@test.com', 'nounou@test.com', 'gestionnaire@test.com');

-- Création des nouveaux utilisateurs de test
INSERT INTO auth.users (
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  confirmation_token,
  recovery_token,
  email_change_token_current,
  email_change_token_new
) VALUES
(
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'parent@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"parent","firstName":"Marie","lastName":"Dupont"}',
  now(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'nounou@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"nounou","firstName":"Sophie","lastName":"Martin"}',
  now(),
  '',
  '',
  '',
  ''
),
(
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'gestionnaire@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"gestionnaire","firstName":"Lucas","lastName":"Bernard"}',
  now(),
  '',
  '',
  '',
  ''
);