import express, { Request, Response } from 'express';
import { pool } from '../db';
import { authenticate, authorize } from '../middleware/auth';
import { userService } from '../services/userService';
import { AuthenticatedRequest } from '../types/user';

const router = express.Router();

// Route pour récupérer la liste des gestionnaires
router.get('/managers', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, created_at, is_active FROM users WHERE role = $1 ORDER BY created_at DESC',
      ['gestionnaire']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des gestionnaires:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer la liste des nounous
router.get('/nannies', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
      ['nounou']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des nounous:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer la liste des parents
router.get('/parents', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
      ['parent']
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des parents:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour créer un gestionnaire
router.post('/managers', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const result = await userService.createUser({
      email,
      password,
      first_name,
      last_name,
      role: 'gestionnaire'
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Erreur lors de la création du gestionnaire:', error);
    res.status(400).json({ message: 'Erreur lors de la création du gestionnaire' });
  }
});

// Route pour mettre à jour un gestionnaire
router.put('/managers/:id', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password, first_name, last_name } = req.body;
    const result = await userService.updateUser(id, { email, password, first_name, last_name });
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du gestionnaire:', error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour du gestionnaire' });
  }
});

// Route pour supprimer un gestionnaire
router.delete('/managers/:id', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteManager(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du gestionnaire:', error);
    res.status(400).json({ message: 'Erreur lors de la suppression du gestionnaire' });
  }
});

// Route pour créer une nounou
router.post('/nannies', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const result = await userService.createUser({
      email,
      password,
      role: 'nounou',
      first_name,
      last_name
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Erreur lors de la création de la nounou:', error);
    res.status(400).json({ message: 'Erreur lors de la création de la nounou' });
  }
});

// Route pour mettre à jour une nounou
router.put('/nannies/:id', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, password } = req.body;
    const result = await userService.updateUser(id, { email, first_name, last_name, password });
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la nounou:', error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour de la nounou' });
  }
});

// Route pour supprimer une nounou
router.delete('/nannies/:id', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression de la nounou:', error);
    res.status(400).json({ message: 'Erreur lors de la suppression de la nounou' });
  }
});

// Route pour créer un parent
router.post('/parents', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const result = await userService.createUser({
      email,
      password,
      role: 'parent',
      first_name,
      last_name
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('Erreur lors de la création du parent:', error);
    res.status(400).json({ message: 'Erreur lors de la création du parent' });
  }
});

// Route pour mettre à jour un parent
router.put('/parents/:id', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, password } = req.body;
    const result = await userService.updateUser(id, { email, first_name, last_name, password });
    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du parent:', error);
    res.status(400).json({ message: 'Erreur lors de la mise à jour du parent' });
  }
});

// Route pour supprimer un parent
router.delete('/parents/:id', authenticate, authorize('admin'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du parent:', error);
    res.status(400).json({ message: 'Erreur lors de la suppression du parent' });
  }
});

export default router; 