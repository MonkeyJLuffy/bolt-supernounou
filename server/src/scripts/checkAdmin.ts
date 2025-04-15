import { pool } from '../db';

async function checkAndRemoveAdmin() {
  const client = await pool.connect();
  try {
    // Vérifier si le compte admin existe
    const result = await client.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      ['admin@bolt-supernounou.com']
    );

    if (result.rows.length > 0) {
      console.log('Compte admin trouvé:', result.rows[0]);
      // Supprimer le compte admin
      await client.query('DELETE FROM users WHERE email = $1', ['admin@bolt-supernounou.com']);
      console.log('Compte admin supprimé avec succès');
    } else {
      console.log('Aucun compte admin trouvé');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification/suppression du compte admin:', error);
  } finally {
    client.release();
  }
}

checkAndRemoveAdmin().catch(console.error); 