import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'SuperNounouBase',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function checkManagers() {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM public.profiles WHERE role = 'gestionnaire'"
    );
    console.log('Nombre de gestionnaires restants:', result.rows[0].count);
  } catch (error) {
    console.error('Erreur lors de la vérification des gestionnaires:', error);
  } finally {
    await pool.end();
  }
}

checkManagers(); 