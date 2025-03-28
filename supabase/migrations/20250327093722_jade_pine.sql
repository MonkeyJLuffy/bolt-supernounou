/*
  # Création des utilisateurs de test

  1. Création des utilisateurs
    - Un parent (Marie Dupont)
    - Une nounou (Sophie Martin)
    - Un gestionnaire (Lucas Bernard)

  2. Sécurité
    - Les mots de passe sont tous "password123"
    - Les utilisateurs sont pré-vérifiés (email_confirmed = true)
*/

-- Création d'un parent de test
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
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'authenticated',
  'authenticated',
  'parent@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"parent","firstName":"Marie","lastName":"Dupont"}',
  now()
);

-- Création d'une nounou de test
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
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'authenticated',
  'authenticated',
  'nounou@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"nounou","firstName":"Sophie","lastName":"Martin"}',
  now()
);

-- Création d'un gestionnaire de test
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
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'authenticated',
  'authenticated',
  'gestionnaire@test.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"gestionnaire","firstName":"Lucas","lastName":"Bernard"}',
  now()
);