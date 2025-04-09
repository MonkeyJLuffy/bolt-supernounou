import { create } from 'zustand';
import { User, UserRole } from '../types/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, firstName: string, lastName: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }

      localStorage.setItem('token', data.token);
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur de connexion', loading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, role: UserRole, firstName: string, lastName: string) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          email, 
          password, 
          role,
          first_name: firstName,
          last_name: lastName
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      // Stocker le token et l'utilisateur directement
      localStorage.setItem('token', data.token);
      set({ user: data.user, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription', loading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ user: null, loading: false });
        return;
      }

      set({ loading: true });
      const response = await fetch('http://localhost:3000/api/auth/check-session', {
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        set({ user: null, loading: false });
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      set({ user: data.user, loading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, loading: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:3000/api/auth/signout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      localStorage.removeItem('token');
      set({ user: null, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },
}));