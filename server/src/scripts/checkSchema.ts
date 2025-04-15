import { pool } from '../db';

async function checkSchema() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Vérifier si la colonne is_active existe
    const { rows: columns } = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'is_active'
    `);

    if (columns.length === 0) {
      console.log('Ajout de la colonne is_active...');
      await client.query(`
        ALTER TABLE users
        ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true
      `);
    }

    // Vérifier si la colonne phone existe
    const { rows: phoneColumns } = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'phone'
    `);

    if (phoneColumns.length === 0) {
      console.log('Ajout de la colonne phone...');
      await client.query(`
        ALTER TABLE users
        ADD COLUMN phone VARCHAR(255)
      `);
    }

    await client.query('COMMIT');
    console.log('Structure de la table vérifiée et mise à jour avec succès');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de la vérification de la structure:', error);
    throw error;
  } finally {
    client.release();
  }
}

checkSchema().catch(console.error); 