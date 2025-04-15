-- Ajout du rôle 'gestionnaire' à la contrainte CHECK
ALTER TABLE users DROP CONSTRAINT users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'parent', 'nounou', 'gestionnaire'));

-- Ajout de la colonne first_login si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'users' AND column_name = 'first_login') THEN
        ALTER TABLE users ADD COLUMN first_login BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Mise à jour des gestionnaires existants pour avoir first_login à true
UPDATE users SET first_login = true WHERE role = 'gestionnaire'; 