import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SuperNounouBase',
  password: 'postgres', // À changer selon votre configuration
  port: 5432,
});

// Clé secrète pour JWT (à mettre dans les variables d'environnement)
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'votre-cle-secrete-jwt';

// Interface pour l'utilisateur
interface User {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

// Fonction pour l'authentification
export const signIn = async (email: string, password: string) => {
  let client;
  try {
    console.log('Tentative de connexion pour:', email);
    
    client = await pool.connect();
    
    // Vérifier les identifiants
    const result = await client.query(
      'SELECT u.*, p.role as user_role, p.first_name, p.last_name FROM auth.users u JOIN public.profiles p ON u.id = p.id WHERE u.email = $1',
      [email]
    );

    console.log('Résultat de la requête:', result.rows);

    const user = result.rows[0];
    if (!user) {
      console.log('Utilisateur non trouvé');
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.encrypted_password);
    console.log('Mot de passe valide:', validPassword);
    
    if (!validPassword) {
      console.log('Mot de passe incorrect');
      throw new Error('Mot de passe incorrect');
    }

    // Créer le token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.user_role
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Token JWT créé');

    // Stocker le token dans un cookie
    Cookies.set('auth_token', token, {
      expires: 1,
      secure: true,
      sameSite: 'lax'
    });

    console.log('Cookie stocké');

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.user_role,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token
    };
  } catch (error) {
    console.error('Erreur détaillée lors de la connexion:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Fonction pour vérifier la session
export const getSession = async () => {
  let client;
  try {
    const token = Cookies.get('auth_token');
    if (!token) {
      return null;
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    client = await pool.connect();
    
    // Récupérer les informations de l'utilisateur
    const result = await client.query(
      'SELECT u.*, p.role as user_role, p.first_name, p.last_name FROM auth.users u JOIN public.profiles p ON u.id = p.id WHERE u.id = $1',
      [decoded.id]
    );

    const user = result.rows[0];
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.user_role,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token
    };
  } catch (error) {
    console.error('Erreur lors de la vérification de la session:', error);
    return null;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Fonction pour la déconnexion
export const signOut = () => {
  Cookies.remove('auth_token');
};

// Export du pool pour les requêtes directes à la base de données
export { pool }; 