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
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'parent@test.com') THEN
    INSERT INTO auth.users (
      instance_id,
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
      'authenticated',
      'authenticated',
      'parent@test.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"parent","firstName":"Marie","lastName":"Dupont"}',
      now()
    );
  END IF;
END $$;

-- Création d'une nounou de test
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nounou@test.com') THEN
    INSERT INTO auth.users (
      instance_id,
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
      'authenticated',
      'authenticated',
      'nounou@test.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"nounou","firstName":"Sophie","lastName":"Martin"}',
      now()
    );
  END IF;
END $$;

-- Création d'un gestionnaire de test
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'gestionnaire@test.com') THEN
    INSERT INTO auth.users (
      instance_id,
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
      'authenticated',
      'authenticated',
      'gestionnaire@test.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"gestionnaire","firstName":"Lucas","lastName":"Bernard"}',
      now()
    );
  END IF;
END $$;