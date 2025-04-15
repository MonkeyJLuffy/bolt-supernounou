import { pool } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserCreateInput, UserUpdateInput, UserLoginInput, UserLoginResponse } from '../types/user';
import { UserRole } from '../types/user';

export class UserService {
  private static readonly SALT_ROUNDS = 10;
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
  private static readonly JWT_EXPIRES_IN = '24h';

  async createUser(input: UserCreateInput): Promise<User> {
    console.log('Création d\'utilisateur avec les données:', input);
    const passwordHash = await bcrypt.hash(input.password, UserService.SALT_ROUNDS);

    try {
      const result = await pool.query(
        `INSERT INTO users (
          email, password, role, first_name, last_name,
          is_active, first_login, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING *`,
        [
          input.email,
          passwordHash,
          input.role,
          input.first_name || null,
          input.last_name || null,
          true,
          input.role === 'gestionnaire' // Les gestionnaires commencent avec first_login = true
        ]
      );
      console.log('Utilisateur créé avec succès:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  async login(input: UserLoginInput): Promise<UserLoginResponse> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [input.email]
    );

    const user = result.rows[0];
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    const validPassword = await bcrypt.compare(input.password, user.password);
    
    if (!validPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      UserService.JWT_SECRET,
      { expiresIn: UserService.JWT_EXPIRES_IN }
    );

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateUser(id: string, input: UserUpdateInput): Promise<User> {
    console.log('Début de la mise à jour de l\'utilisateur:', id);
    console.log('Données de mise à jour reçues:', input);
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Construire la requête de mise à jour dynamiquement
    if (input.email) {
      updates.push(`email = $${paramCount}`);
      values.push(input.email);
      paramCount++;
    }
    if (input.password) {
      const passwordHash = await bcrypt.hash(input.password, UserService.SALT_ROUNDS);
      updates.push(`password = $${paramCount}`);
      values.push(passwordHash);
      paramCount++;
    }
    if (input.role) {
      updates.push(`role = $${paramCount}`);
      values.push(input.role);
      paramCount++;
    }
    if (input.first_name !== undefined) {
      updates.push(`first_name = $${paramCount}`);
      values.push(input.first_name);
      paramCount++;
    }
    if (input.last_name !== undefined) {
      updates.push(`last_name = $${paramCount}`);
      values.push(input.last_name);
      paramCount++;
    }
    if (input.phone !== undefined) {
      updates.push(`phone = $${paramCount}`);
      values.push(input.phone);
      paramCount++;
    }
    if (input.address !== undefined) {
      updates.push(`address = $${paramCount}`);
      values.push(input.address);
      paramCount++;
    }
    if (input.city !== undefined) {
      updates.push(`city = $${paramCount}`);
      values.push(input.city);
      paramCount++;
    }
    if (input.postal_code !== undefined) {
      updates.push(`postal_code = $${paramCount}`);
      values.push(input.postal_code);
      paramCount++;
    }
    if (input.is_active !== undefined) {
      updates.push(`is_active = $${paramCount}`);
      values.push(input.is_active);
      paramCount++;
    }
    if (input.first_login !== undefined) {
      console.log('Mise à jour du flag first_login:', input.first_login);
      updates.push(`first_login = $${paramCount}`);
      values.push(input.first_login);
      paramCount++;
    }

    // Toujours mettre à jour updated_at
    updates.push(`updated_at = NOW()`);

    if (updates.length === 1) { // Seulement updated_at a été ajouté
      console.log('Aucune donnée à mettre à jour pour l\'utilisateur:', id);
      throw new Error('Aucune donnée à mettre à jour');
    }

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    values.push(id);

    console.log('Requête SQL générée:', query);
    console.log('Paramètres:', values);

    const result = await pool.query(query, values);
    console.log('Mise à jour effectuée avec succès:', result.rows[0]);
    
    return result.rows[0];
  }

  async deleteUser(id: string): Promise<void> {
    const result = await pool.query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      throw new Error('Utilisateur non trouvé');
    }
  }

  async listUsers(
    page: number = 1,
    limit: number = 10,
    role?: string,
    searchTerm?: string
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM users WHERE is_active = true';
    const values: any[] = [];
    let paramCount = 1;

    if (role) {
      query += ` AND role = $${paramCount}`;
      values.push(role);
      paramCount++;
    }

    if (searchTerm) {
      query += ` AND (
        email ILIKE $${paramCount} OR
        first_name ILIKE $${paramCount} OR
        last_name ILIKE $${paramCount}
      )`;
      values.push(`%${searchTerm}%`);
      paramCount++;
    }

    // Compter le total
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${query}) AS count`,
      values
    );
    const total = parseInt(countResult.rows[0].count);

    // Récupérer les résultats paginés
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return { users: result.rows, total };
  }

  async getManagers() {
    const result = await pool.query(
      'SELECT id, email, role, created_at FROM users WHERE role = $1',
      ['gestionnaire']
    );
    return result.rows;
  }

  async createManager(data: { email: string; password: string; first_name: string; last_name: string }) {
    const passwordHash = await bcrypt.hash(data.password, UserService.SALT_ROUNDS);
    const result = await pool.query(
      'INSERT INTO users (email, password, role, first_name, last_name, first_login) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role, first_name, last_name, created_at, first_login',
      [data.email, passwordHash, 'gestionnaire', data.first_name, data.last_name, true]
    );
    return result.rows[0];
  }

  async updateManager(id: string, data: { email?: string; password?: string; first_login?: boolean }) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.email) {
      updates.push(`email = $${paramCount}`);
      values.push(data.email);
      paramCount++;
    }

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updates.push(`password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }

    if (data.first_login !== undefined) {
      updates.push(`first_login = $${paramCount}`);
      values.push(data.first_login);
      paramCount++;
    }

    if (updates.length === 0) {
      return this.getUserById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, role, created_at, first_login`,
      values
    );
    return result.rows[0];
  }

  async deleteManager(id: string) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 AND role = $2',
      [id, 'gestionnaire']
    );

    if (result.rowCount === 0) {
      throw new Error('Gestionnaire non trouvé');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0] || null;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await bcrypt.hash(newPassword, UserService.SALT_ROUNDS);
    
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, userId]
    );
  }
}

export const userService = new UserService(); 