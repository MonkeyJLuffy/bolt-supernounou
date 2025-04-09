import { User, UserRole } from '../types/auth';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api';

export async function signIn(email: string, password: string): Promise<{ user: User; token: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Identifiants invalides');
    }

    const data = await response.json();
    Cookies.set('token', data.token);
    return data;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
}

export async function checkSession(): Promise<User | null> {
  const token = Cookies.get('token');
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/auth/session`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      Cookies.remove('token');
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Erreur de vérification de session:', error);
    Cookies.remove('token');
    return null;
  }
}

export async function signOut(): Promise<void> {
  Cookies.remove('token');
} 