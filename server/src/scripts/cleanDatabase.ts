import { pool } from '../db';

async function cleanDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Supprimer toutes les tables dans l'ordre inverse des dépendances
    await client.query('DROP TABLE IF EXISTS reviews CASCADE');
    await client.query('DROP TABLE IF EXISTS payments CASCADE');
    await client.query('DROP TABLE IF EXISTS bookings CASCADE');
    await client.query('DROP TABLE IF EXISTS availabilities CASCADE');
    await client.query('DROP TABLE IF EXISTS users CASCADE');
    await client.query('DROP TABLE IF EXISTS migrations CASCADE');

    await client.query('COMMIT');
    console.log('Base de données nettoyée avec succès');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur lors du nettoyage de la base de données:', error);
    throw error;
  } finally {
    client.release();
  }
}

cleanDatabase().catch(console.error); 