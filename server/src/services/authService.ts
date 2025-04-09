import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
  private static readonly JWT_EXPIRES_IN = '24h';

  async verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, AuthService.JWT_SECRET) as { id: string; role: string };
      const result = await pool.query(
        'SELECT id, email, role FROM users WHERE id = $1',
        [decoded.id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      return result.rows[0];
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  async generateToken(userId: string, role: string) {
    return jwt.sign(
      { id: userId, role },
      AuthService.JWT_SECRET,
      { expiresIn: AuthService.JWT_EXPIRES_IN }
    );
  }
}

export const authService = new AuthService(); 