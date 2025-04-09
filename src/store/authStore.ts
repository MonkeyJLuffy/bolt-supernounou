import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthResponse, User, UserRole, mapServerUserToClient } from '../types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      error: null,
      signIn: async (email: string, password: string): Promise<AuthResponse> => {
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

          // Stocker le token dans le localStorage
          localStorage.setItem('token', data.token);
          
          // Mapper les données du serveur vers notre interface User
          const user = mapServerUserToClient(data.user);
          
          // Mettre à jour l'état de l'utilisateur
          set({ user, token: data.token, loading: false });

          return data;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur de connexion', loading: false });
          throw error;
        }
      },

      signUp: async (email: string, password: string, role: UserRole, firstName: string, lastName: string): Promise<AuthResponse> => {
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
              firstName,
              lastName
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Erreur lors de l\'inscription');
          }

          // Stocker le token dans le localStorage
          localStorage.setItem('token', data.token);
          
          // Mapper les données du serveur vers notre interface User
          const user = mapServerUserToClient(data.user);
          
          // Mettre à jour l'état de l'utilisateur
          set({ user, token: data.token, loading: false });

          return data;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription', loading: false });
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            set({ user: null, token: null, loading: false });
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
            set({ user: null, token: null, loading: false });
            return;
          }

          const data = await response.json();
          localStorage.setItem('token', data.token);
          
          // Mapper les données du serveur vers notre interface User
          const user = mapServerUserToClient(data.user);
          
          // Mettre à jour l'état de l'utilisateur
          set({ user, token, loading: false });
        } catch (error) {
          localStorage.removeItem('token');
          set({ user: null, token: null, loading: false });
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
          set({ user: null, token: null, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      setDemoUser: (user: User) => {
        set({ user, token: 'demo-token-123', error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);