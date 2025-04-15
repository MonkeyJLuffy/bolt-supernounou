import { pool } from '../db';
import * as fs from 'fs';
import * as path from 'path';

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Création de la table des migrations si elle n'existe pas
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Récupération des migrations déjà exécutées
    const { rows: executedMigrations } = await client.query(
      'SELECT name FROM migrations'
    );
    const executedMigrationNames = executedMigrations.map(m => m.name);

    // Lecture des fichiers de migration
    const migrationsDir = path.join(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Exécution des migrations non appliquées
    for (const file of migrationFiles) {
      if (!executedMigrationNames.includes(file)) {
        console.log(`Exécution de la migration: ${file}`);
        const migration = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await client.query(migration);
        await client.query(
          'INSERT INTO migrations (name) VALUES ($1)',
          [file]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Toutes les migrations ont été exécutées avec succès');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur lors de l\'exécution des migrations:', error);
    throw error;
  } finally {
    client.release();
  }
}

runMigrations().catch(console.error); 