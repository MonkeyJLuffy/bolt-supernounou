import express, { Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../middleware/auth.js';
import { userService } from '../services/userService.js';
import { UserRole } from '../types/user.js';
import { UserService } from '../services/userService.js';
import { AuthService } from '../services/authService.js';
import { validateLoginInput } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();
const userService = new UserService();
const authService = new AuthService();

// Schémas de validation
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
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
    const result = await userService.login({ email, password });
    res.json(result);
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
    console.error('Erreur de connexion:', error);
    res.status(401).json({ 
      message: error instanceof Error ? error.message : 'Erreur de connexion' 
    });
  }
});

// Route de vérification de session
router.get('/check-session', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userService.getUserById(req.user!.id);
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
router.get('/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userService.getUserById(req.user!.id);
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

router.put('/profile', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await userService.updateUser(req.user!.id, req.body);
    const { password_hash, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour du profil' });
  }
});

// Routes admin
router.get('/users', authenticate, authorize('admin', 'gestionnaire'), async (req: AuthenticatedRequest, res: Response) => {
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

router.delete('/users/:id', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(400).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

export default router; 