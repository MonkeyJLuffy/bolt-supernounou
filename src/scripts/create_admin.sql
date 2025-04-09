-- Activer l'extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Vérifier et créer les schémas si nécessaire
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    CREATE SCHEMA auth;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'public') THEN
    CREATE SCHEMA public;
  END IF;
END $$;

-- Accorder les permissions sur les schémas
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role, authenticator;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, authenticator;

-- Accorder les permissions sur les tables du schéma auth
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO authenticator;
GRANT INSERT ON ALL TABLES IN SCHEMA auth TO authenticator;
GRANT UPDATE ON ALL TABLES IN SCHEMA auth TO authenticator;
GRANT DELETE ON ALL TABLES IN SCHEMA auth TO authenticator;

-- Accorder les permissions sur les séquences du schéma auth
GRANT USAGE ON ALL SEQUENCES IN SCHEMA auth TO authenticator;

-- Accorder les permissions sur les tables du schéma public
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role, authenticator;

-- Accorder les permissions sur les séquences du schéma public
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role, authenticator;

-- Créer ou mettre à jour l'utilisateur admin
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Vérifier si l'utilisateur admin existe déjà
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@supernounou.fr';
  
  IF admin_id IS NULL THEN
    -- Créer un nouvel utilisateur admin
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
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_current,
      email_change_token_new
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
      now(),
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_id;

    -- Créer l'identité email pour l'utilisateur admin
    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      created_at,
      updated_at,
      last_sign_in_at
    ) VALUES (
      gen_random_uuid(),
      admin_id,
      admin_id::text,
      jsonb_build_object(
        'email', 'admin@supernounou.fr',
        'sub', admin_id::text
      ),
      'email',
      now(),
      now(),
      now()
    );

    RAISE NOTICE 'Utilisateur admin et identité créés avec succès';
  ELSE
    -- Mettre à jour le profil admin existant
    UPDATE public.profiles
    SET 
      role = 'admin',
      first_name = 'Admin',
      last_name = 'System',
      is_approved = true
    WHERE email = 'admin@supernounou.fr';

    -- Vérifier si l'identité existe déjà
    IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = admin_id AND provider = 'email') THEN
      -- Créer l'identité email si elle n'existe pas
      INSERT INTO auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        created_at,
        updated_at,
        last_sign_in_at
      ) VALUES (
        gen_random_uuid(),
        admin_id,
        admin_id::text,
        jsonb_build_object(
          'email', 'admin@supernounou.fr',
          'sub', admin_id::text
        ),
        'email',
        now(),
        now(),
        now()
      );
      RAISE NOTICE 'Identité email créée pour l''utilisateur admin existant';
    END IF;

    RAISE NOTICE 'Profil admin mis à jour avec succès';
  END IF;
END $$; 