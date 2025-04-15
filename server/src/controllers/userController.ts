import { Request, Response } from 'express';
import { userService } from '../services/userService';
import { UserRole, AuthenticatedRequest } from '../types/user';

export const userController = {
  async register(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(400).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await userService.login({ email, password });
      res.json(result);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
  },

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      const user = await userService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const { password_hash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      const user = await userService.updateUser(req.user.id, req.body);
      const { password_hash, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      res.status(400).json({ message: 'Erreur lors de la mise à jour du profil' });
    }
  },

  async listUsers(req: AuthenticatedRequest, res: Response) {
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
  },

  async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      res.status(400).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  }
}; 