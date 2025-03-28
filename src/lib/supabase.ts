import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sjudvjlqwgcsyzeenkdb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqdWR2amxxd2djc3l6ZWVua2RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxNzAzNzAsImV4cCI6MjA1ODc0NjM3MH0.Y5k092LlZgtj8MopSRJ4DegUdrHCsbPuRlhwpY8SZ2E';

// Initialisation du client Supabase avec les options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: {
      getItem: (key) => {
        console.log('Récupération de la session:', key);
        return localStorage.getItem(key);
      },
      setItem: (key, value) => {
        console.log('Stockage de la session:', key, value);
        localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        console.log('Suppression de la session:', key);
        localStorage.removeItem(key);
      }
    }
  }
});

// Test de la connexion
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Erreur lors de la connexion à Supabase:', error.message);
    console.error('Détails de l\'erreur:', error);
  } else {
    console.log('Connexion Supabase établie avec succès');
    console.log('Session:', data.session);
    if (data.session?.user) {
      console.log('Utilisateur:', data.session.user);
      console.log('Métadonnées:', data.session.user.user_metadata);
    }
  }
});

// Fonction de test pour vérifier la connexion à la base de données
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Erreur lors du test de la base de données:', error.message);
      console.error('Détails de l\'erreur:', error);
      return false;
    }

    console.log('Test de la base de données réussi');
    return true;
  } catch (error) {
    console.error('Erreur inattendue lors du test de la base de données:', error);
    return false;
  }
};

// Exécuter le test au démarrage
testDatabaseConnection();