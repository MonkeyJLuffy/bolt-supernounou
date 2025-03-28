import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Validation des variables d'environnement
if (!supabaseUrl || supabaseUrl.trim() === '') {
  throw new Error('L\'URL Supabase est manquante ou vide');
}

if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
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