import { pool } from '../db';
import { UserService } from '../services/userService';

async function initializeDatabase() {
  try {
    // Créer la table users si elle n'existe pas
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        first_login BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Vérifier si l'utilisateur gestionnaire existe déjà
    const userService = new UserService();
    const existingManager = await userService.getUserByEmail('gestionnaire@supernounou.fr');

    if (!existingManager) {
      // Créer l'utilisateur gestionnaire
      await userService.createUser({
        email: 'gestionnaire@supernounou.fr',
        password: 'Gestionnaire123!',
        role: 'gestionnaire',
        first_name: 'Super',
        last_name: 'Gestionnaire'
      });
      console.log('Utilisateur gestionnaire créé avec succès');
    } else {
      console.log('L\'utilisateur gestionnaire existe déjà');
    }

    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
  } finally {
    await pool.end();
  }
}

initializeDatabase(); 