-- Supprimer tous les utilisateurs de type gestionnaire
DELETE FROM auth.users
WHERE id IN (
  SELECT id 
  FROM public.profiles 
  WHERE role = 'gestionnaire'
);

-- Supprimer tous les profils de type gestionnaire
DELETE FROM public.profiles
WHERE role = 'gestionnaire';

-- Vérifier le nombre de gestionnaires restants
SELECT COUNT(*) FROM public.profiles WHERE role = 'gestionnaire'; 