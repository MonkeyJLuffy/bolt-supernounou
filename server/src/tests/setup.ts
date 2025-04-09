import { beforeAll, afterAll } from '@jest/globals';
import { pool } from '../db.js';

// Configuration des variables d'environnement pour les tests
process.env.DB_USER = 'postgres';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'supernounou_test';
process.env.DB_PASSWORD = 'SuperNounouPassword';
process.env.DB_PORT = '5432';
process.env.JWT_SECRET = 'test_secret_key';

// Nettoyage de la base de données avant les tests
beforeAll(async () => {
  // Vider la table users
  await pool.query('TRUNCATE TABLE users CASCADE');
});

afterAll(async () => {
  // Fermer la connexion à la base de données
  await pool.end();
}); 