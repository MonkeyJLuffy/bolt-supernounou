import { config } from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';

// Charger les variables d'environnement
config();

// Créer un nouveau pool de connexion
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function resetDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Début de la réinitialisation de la base de données...');
    
    // Supprimer la table users si elle existe
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('Table users supprimée');
    
    // Créer la table users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        postal_code VARCHAR(10),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table users recréée avec succès');

    // Créer l'utilisateur admin
    console.log('Création de l\'utilisateur admin...');
    const hashedPassword = await bcrypt.hash('SuperNounouPassword', 10);
    
    await client.query(
      `INSERT INTO users (
        email, password_hash, role, first_name, last_name, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6)`,
      ['admin@supernounou.fr', hashedPassword, 'admin', 'Admin', 'System', true]
    );
    console.log('Utilisateur admin créé avec succès');

    // Vérifier le contenu de la table
    const users = await client.query('SELECT id, email, role, is_active FROM users');
    console.log('Contenu de la table users:');
    console.log(users.rows);

  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase()
  .then(() => {
    console.log('Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur lors de l\'exécution du script:', error);
    process.exit(1);
  }); 