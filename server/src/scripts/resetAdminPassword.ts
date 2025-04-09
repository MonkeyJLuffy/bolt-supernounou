import { config } from 'dotenv';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';

// Charger les variables d'environnement
config();

async function resetAdminPassword() {
  const client = await pool.connect();
  
  try {
    console.log('Réinitialisation du mot de passe admin...');
    const hashedPassword = await bcrypt.hash('SuperNounouPassword', 10);
    
    const result = await client.query(
      `UPDATE users 
       SET password_hash = $1, updated_at = NOW()
       WHERE email = $2
       RETURNING email, role`,
      [hashedPassword, 'admin@supernounou.fr']
    );

    if (result.rowCount === 0) {
      console.log('Utilisateur admin non trouvé');
      return;
    }

    console.log('Mot de passe admin réinitialisé avec succès');
    console.log('Nouveau mot de passe: SuperNounouPassword');

  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

resetAdminPassword()
  .then(() => {
    console.log('Script terminé avec succès');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erreur lors de l\'exécution du script:', error);
    process.exit(1);
  }); 