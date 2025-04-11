import express, { Request, Response, Router } from 'express';
import { z } from 'zod';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../middleware/auth.js';
import { UserService } from '../services/userService.js';
import { UserRole } from '../types/user.js';
import { AuthService } from '../services/authService.js';
import { validateLoginInput } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  first_name?: string;
  last_name?: string;
}

const router = Router();
const userService = new UserService();
const authService = new AuthService();

// Schémas de validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'gestionnaire', 'nounou', 'parent']),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional()
});

// Route d'inscription
router.post('/register', async (req: Request, res: Response) => {
  try {
    const userData = registerSchema.parse(req.body);
    const user = await userService.createUser(userData);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Données invalides', 
        errors: error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
    }
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(400).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// Route de connexion
router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Vérifier les identifiants
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    // Retourner les données de l'utilisateur et le token
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        first_login: user.role === 'gestionnaire' ? user.first_login : false
      },
      token
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route de vérification de session
router.get('/check-session', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    const user = await userService.getUserById(authReq.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const { password_hash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Erreur de vérification de session:', error);
    res.status(401).json({ message: 'Session invalide' });
  }
});

// Route de déconnexion
router.post('/signout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Déconnexion réussie' });
});

// Routes protégées
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    const user = await userService.getUserById(authReq.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    const user = await userService.updateUser(authReq.user.id, req.body);
    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
});

// Routes admin
router.get('/users', authenticate, authorize('admin', 'gestionnaire'), async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const searchTerm = req.query.search as string;

    const result = await userService.listUsers(page, limit, role, searchTerm);
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/users/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(400).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// Endpoint de vérification admin
router.post('/verify-admin', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    // Vérifier si l'utilisateur est un admin
    if (authReq.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    // Vérifier les identifiants une deuxième fois
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    res.json({ message: 'Vérification admin réussie' });
  } catch (error) {
    console.error('Erreur lors de la vérification admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/change-password', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    const { newPassword } = req.body;
    const userId = authReq.user.id;

    await userService.updatePassword(userId, newPassword);
    
    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ message: 'Erreur lors du changement de mot de passe' });
  }
});

// Route pour récupérer les informations de l'utilisateur connecté
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }
    const user = await userService.getUserById(authReq.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router; 