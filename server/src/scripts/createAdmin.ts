import { pool } from '../db.js';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    const password = 'SuperNounouPassword';
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (
        email, password_hash, role, first_name, last_name,
        is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *`,
      [
        'admin@supernounou.fr',
        passwordHash,
        'admin',
        'Admin',
        'System',
        true
      ]
    );

    console.log('Administrateur créé avec succès:');
    console.log(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await pool.end();
  }
}

createAdmin(); 