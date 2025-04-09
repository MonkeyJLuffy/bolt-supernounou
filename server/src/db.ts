import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Interface pour la configuration de la base de données
interface DatabaseConfig {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

// Configuration de la connexion à la base de données
const dbConfig: DatabaseConfig = {
  user: process.env.DB_USER || '',
  host: process.env.DB_HOST || '',
  database: process.env.DB_NAME || '',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
  // Paramètres de connexion supplémentaires
  max: 20, // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000, // Temps maximum d'inactivité d'un client
  connectionTimeoutMillis: 2000, // Temps maximum pour établir une connexion
};

// Vérifier que toutes les variables d'environnement requises sont définies
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  throw new Error(`Variables d'environnement manquantes : ${missingEnvVars.join(', ')}`);
}

// Créer le pool de connexions
const pool = new Pool(dbConfig);

// Gérer les erreurs du pool
pool.on('error', (err) => {
  console.error('Erreur inattendue du pool de connexions:', err.message);
});

export { pool };
export type { DatabaseConfig }; 