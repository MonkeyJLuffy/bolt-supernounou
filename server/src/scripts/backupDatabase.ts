import { pool } from '../db';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

async function backupDatabase() {
  const backupDir = path.join(__dirname, '../../backups');
  
  // Créer le dossier de sauvegarde s'il n'existe pas
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `backup-${timestamp}.sql`);

  try {
    // Récupérer les informations de connexion depuis la pool
    const { host, port, database, user, password } = pool.options;

    // Créer la commande pg_dump
    const command = `pg_dump -h ${host} -p ${port} -U ${user} -d ${database} > ${backupFile}`;

    // Exécuter la commande
    await new Promise<void>((resolve, reject) => {
      exec(command, { env: { PGPASSWORD: password as string } }, (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    console.log(`Sauvegarde créée avec succès : ${backupFile}`);
    return backupFile;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde :', error);
    throw error;
  }
}

backupDatabase().catch(console.error); 