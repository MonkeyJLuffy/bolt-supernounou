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
) ON CONFLICT (email) DO NOTHING;

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