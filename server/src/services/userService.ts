import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserCreateInput, UserUpdateInput, UserLoginInput, UserLoginResponse } from '../types/user.js';

export class UserService {
  private static readonly SALT_ROUNDS = 10;
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
  private static readonly JWT_EXPIRES_IN = '24h';

  async createUser(input: UserCreateInput): Promise<User> {
    const passwordHash = await bcrypt.hash(input.password, UserService.SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO users (
        email, password_hash, role, first_name, last_name,
        phone, address, city, postal_code, is_active,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *`,
      [
        input.email,
        passwordHash,
        input.role,
        input.first_name || null,
        input.last_name || null,
        input.phone || null,
        input.address || null,
        input.city || null,
        input.postal_code || null,
        true
      ]
    );

    return result.rows[0];
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
    
    const validPassword = await bcrypt.compare(input.password, user.password_hash);
    
    if (!validPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      UserService.JWT_SECRET,
      { expiresIn: UserService.JWT_EXPIRES_IN }
    );

    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async updateUser(id: string, input: UserUpdateInput): Promise<User> {
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
      updates.push(`password_hash = $${paramCount}`);
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

    updates.push(`updated_at = NOW()`);

    if (updates.length === 0) {
      throw new Error('Aucune donnée à mettre à jour');
    }

    values.push(id);
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

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

  async createManager(data: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at',
      [data.email, hashedPassword, 'gestionnaire']
    );
    return result.rows[0];
  }

  async updateManager(id: string, data: { email?: string; password?: string }) {
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
      updates.push(`password_hash = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }

    if (updates.length === 0) {
      return this.getUserById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, role, created_at`,
      values
    );
    return result.rows[0];
  }

  async deleteManager(id: string) {
    await pool.query('DELETE FROM users WHERE id = $1 AND role = $2', [id, 'gestionnaire']);
  }
}

export const userService = new UserService(); 