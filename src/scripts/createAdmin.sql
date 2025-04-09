-- Activer l'extension pgcrypto si elle n'est pas déjà activée
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Créer l'utilisateur admin dans auth.users s'il n'existe pas déjà
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Vérifier si l'utilisateur admin existe déjà
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@supernounou.fr';
  
  IF admin_id IS NULL THEN
    -- Créer l'utilisateur admin
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
    
    -- Créer le profil admin
    INSERT INTO public.profiles (
      id,
      email,
      role,
      first_name,
      last_name,
      is_approved
    ) VALUES (
      admin_id,
      'admin@supernounou.fr',
      'admin',
      'Admin',
      'System',
      true
    );
    
    RAISE NOTICE 'Utilisateur admin créé avec succès';
  ELSE
    RAISE NOTICE 'L''utilisateur admin existe déjà';
  END IF;
END $$; 