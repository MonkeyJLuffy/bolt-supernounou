import { pool } from '../db';
import bcrypt from 'bcrypt';

async function createAdmin() {
  const client = await pool.connect();
  try {
    const email = 'admin@supernounou.fr';
    const password = 'SuperNounouPassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Vérifier si l'admin existe déjà
    const checkResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (checkResult.rows.length > 0) {
      console.log('Le compte admin existe déjà');
      return;
    }

    // Créer le compte admin
    await client.query(
      `INSERT INTO users (email, password, first_name, last_name, role, first_login)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [email, hashedPassword, 'Admin', 'SuperNounou', 'admin', true]
    );

    console.log('Compte admin créé avec succès');
    console.log('Email:', email);
    console.log('Mot de passe:', password);
  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
  } finally {
    client.release();
  }
}

createAdmin().catch(console.error); 