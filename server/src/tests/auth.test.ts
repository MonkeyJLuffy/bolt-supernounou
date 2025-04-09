import request from 'supertest';
import express from 'express';
import { authRouter } from '../routes/auth.js';
import { userService } from '../services/userService.js';
import { UserRole } from '../types/user.js';

// Créer une application Express pour les tests
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

// Données de test
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  role: 'admin' as UserRole,
  first_name: 'Test',
  last_name: 'User'
};

let authToken: string;
let userId: string;

describe('Routes d\'authentification', () => {
  // Test d'inscription
  describe('POST /api/auth/register', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.role).toBe(testUser.role);
      
      // Sauvegarder l'ID pour les tests suivants
      userId = response.body.id;
    });

    it('devrait échouer avec des données invalides', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: '123', // Trop court
          role: 'invalid-role'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Données invalides');
    });
  });

  // Test de connexion
  describe('POST /api/auth/login', () => {
    it('devrait connecter un utilisateur existant', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
      
      // Sauvegarder le token pour les tests suivants
      authToken = response.body.token;
    });

    it('devrait échouer avec des identifiants incorrects', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Email ou mot de passe incorrect');
    });
  });

  // Test de vérification de session
  describe('GET /api/auth/session', () => {
    it('devrait retourner les informations de l\'utilisateur connecté', async () => {
      const response = await request(app)
        .get('/api/auth/session')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('devrait échouer sans token', async () => {
      const response = await request(app)
        .get('/api/auth/session');

      expect(response.status).toBe(401);
    });
  });

  // Test de récupération du profil
  describe('GET /api/auth/profile', () => {
    it('devrait retourner le profil de l\'utilisateur', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
    });
  });

  // Test de mise à jour du profil
  describe('PUT /api/auth/profile', () => {
    it('devrait mettre à jour le profil de l\'utilisateur', async () => {
      const updatedData = {
        first_name: 'Updated',
        last_name: 'Name'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.first_name).toBe(updatedData.first_name);
      expect(response.body.last_name).toBe(updatedData.last_name);
    });
  });

  // Test de liste des utilisateurs (admin)
  describe('GET /api/auth/users', () => {
    it('devrait retourner la liste des utilisateurs pour un admin', async () => {
      const response = await request(app)
        .get('/api/auth/users')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });

  // Test de suppression d'utilisateur (admin)
  describe('DELETE /api/auth/users/:id', () => {
    it('devrait supprimer un utilisateur', async () => {
      // Créer un utilisateur à supprimer
      const userToDelete = await userService.createUser({
        email: 'delete@example.com',
        password: 'password123',
        role: 'parent' as UserRole
      });

      const response = await request(app)
        .delete(`/api/auth/users/${userToDelete.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Vérifier que l'utilisateur est désactivé
      const deletedUser = await userService.getUserById(userToDelete.id);
      expect(deletedUser?.is_active).toBe(false);
    });
  });

  // Nettoyage après les tests
  afterAll(async () => {
    // Supprimer l'utilisateur de test
    await userService.deleteUser(userId);
  });
}); 