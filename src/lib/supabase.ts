import { createClient } from '@supabase/supabase-js';

// Log des variables d'environnement pour le débogage (à supprimer en production)
console.log('URL Supabase:', import.meta.env.VITE_SUPABASE_URL);
console.log('Clé Anon Supabase existe:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation des variables d'environnement
if (!supabaseUrl || supabaseUrl.trim() === '') {
  console.error('L\'URL Supabase (VITE_SUPABASE_URL) est manquante ou vide');
  throw new Error('L\'URL Supabase est manquante ou vide');
}

if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
  console.error('La clé anonyme Supabase (VITE_SUPABASE_ANON_KEY) est manquante ou vide');
  throw new Error('La clé anonyme Supabase est manquante ou vide');
}

// Initialisation du client Supabase avec les options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test de la connexion
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Erreur de connexion Supabase:', error.message);
  } else {
    console.log('Connexion Supabase établie avec succès');
  }
});