import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Erreur:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Données invalides',
      errors: err.errors
    });
  }

  res.status(500).json({
    message: 'Erreur serveur interne'
  });
}; 