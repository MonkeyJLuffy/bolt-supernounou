import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Les variables d\'environnement Supabase sont manquantes');
}

// Créer un client Supabase avec la clé de service pour avoir tous les droits
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function initDatabase() {
  try {
    console.log('Début de l\'initialisation de la base de données...');

    // Vérifier si la table profiles existe
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (profilesError) {
      console.log('Création des tables...');
      
      // Créer la table profiles
      const { error: createProfilesError } = await supabase.rpc('create_profiles_table');
      if (createProfilesError) throw createProfilesError;

      // Créer la table children
      const { error: createChildrenError } = await supabase.rpc('create_children_table');
      if (createChildrenError) throw createChildrenError;

      // Créer la table parent_children
      const { error: createParentChildrenError } = await supabase.rpc('create_parent_children_table');
      if (createParentChildrenError) throw createParentChildrenError;

      // Créer la table parent_couples
      const { error: createParentCouplesError } = await supabase.rpc('create_parent_couples_table');
      if (createParentCouplesError) throw createParentCouplesError;

      console.log('Tables créées avec succès !');
    } else {
      console.log('Les tables existent déjà.');
    }

    // Vérifier si l'utilisateur admin existe
    const { data: adminUser, error: adminError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', 'admin@supernounou.fr')
      .single();

    if (adminError || !adminUser) {
      console.log('Création de l\'utilisateur admin...');
      
      // Créer l'utilisateur admin avec la clé de service
      const { data: newAdmin, error: createAdminError } = await supabase.auth.admin.createUser({
        email: 'admin@supernounou.fr',
        password: 'administrateur',
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          firstName: 'Admin',
          lastName: 'System'
        }
      });

      if (createAdminError) {
        throw createAdminError;
      }

      console.log('Utilisateur admin créé avec succès !');
    } else {
      console.log('L\'utilisateur admin existe déjà.');
    }

    console.log('Initialisation de la base de données terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

// Exécuter l'initialisation
initDatabase(); 