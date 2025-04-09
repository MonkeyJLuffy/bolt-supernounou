import { pool } from '../db.js';

async function checkUsers() {
  try {
    const result = await pool.query('SELECT * FROM users');
    console.log('Utilisateurs dans la base de données:');
    console.log(result.rows);
  } catch (error) {
    console.error('Erreur lors de la vérification des utilisateurs:', error);
  } finally {
    await pool.end();
  }
}

checkUsers(); 