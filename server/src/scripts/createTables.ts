import { config } from 'dotenv';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';

// Charger les variables d'environnement
config();

async function createTables() {
  const client = await pool.connect();
  
  try {
    console.log('Début de la création des tables...');
    
    // Créer la table users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table users créée avec succès');

    // Vérifier si l'utilisateur admin existe déjà
    const adminCheck = await client.query(
      'SELECT * FROM users WHERE email = $1',
      ['admin@supernounou.fr']
    );

    if (adminCheck.rows.length === 0) {
      console.log('Création de l\'utilisateur admin...');
      const hashedPassword = await bcrypt.hash('SuperNounouPassword', 10);
      
      await client.query(
        `INSERT INTO users (email, password_hash, role, is_active)
         VALUES ($1, $2, $3, $4)`,
        ['admin@supernounou.fr', hashedPassword, 'admin', true]
      );
      console.log('Utilisateur admin créé avec succès');
    } else {
      console.log('L\'utilisateur admin existe déjà');
    }

    // Vérifier le contenu de la table
    const users = await client.query('SELECT id, email, role, is_active FROM users');
    console.log('Contenu de la table users:');
    console.log(users.rows);

  } catch (error) {
    console.error('Erreur lors de la création des tables:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

createTables()
  .then(() => {
    console.log('Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur lors de l\'exécution du script:', error);
    process.exit(1);
  }); 