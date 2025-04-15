import { pool } from '../db';

async function checkUsers() {
  const client = await pool.connect();
  try {
    // Vérifier tous les utilisateurs
    const result = await client.query(
      'SELECT id, email, role, first_login FROM users ORDER BY role, email'
    );

    console.log('\n=== Liste des utilisateurs ===');
    if (result.rows.length === 0) {
      console.log('Aucun utilisateur trouvé dans la base de données');
    } else {
      result.rows.forEach(user => {
        console.log(`- ${user.email} (${user.role}) - First login: ${user.first_login}`);
      });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des utilisateurs:', error);
  } finally {
    client.release();
  }
}

checkUsers().catch(console.error); 