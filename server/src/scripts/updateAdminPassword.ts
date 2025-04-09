import { pool } from '../db.js';
import bcrypt from 'bcrypt';

async function updateAdminPassword() {
  const client = await pool.connect();
  try {
    const password = 'SuperNounouPassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email',
      [hashedPassword, 'admin@supernounou.fr']
    );

    if (result.rowCount === 0) {
      console.log('Aucun utilisateur admin trouvé');
    } else {
      console.log('Mot de passe admin mis à jour avec succès');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
  } finally {
    client.release();
  }
}

updateAdminPassword(); 