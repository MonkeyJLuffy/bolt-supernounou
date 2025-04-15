import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    first_name?: string;
    last_name?: string;
    created_at: string;
    first_login?: boolean;
  };
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    (req as AuthenticatedRequest).user = decoded as any;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

export const authenticateToken = authenticate;

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    
    if (!authReq.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (!roles.includes(authReq.user.role)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }

    next();
  };
};

export const isAuthenticated = (req: AuthenticatedRequest): boolean => {
  return !!req.user;
};

export const isAuthorized = (req: AuthenticatedRequest, ...roles: UserRole[]): boolean => {
  return isAuthenticated(req) && roles.includes(req.user!.role);
}; 