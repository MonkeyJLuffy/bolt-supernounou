import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthResponse, User, UserRole, mapServerUserToClient } from '../types/auth';
import Cookies from 'js-cookie';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      error: null,
      loading: false,
      checkAuth: async () => {
        const token = Cookies.get('auth_token');
        if (!token) {
          set({ user: null, token: null, loading: false });
          return;
        }

        try {
          set({ loading: true });
          const response = await fetch('http://localhost:3000/api/auth/me', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            const user = mapServerUserToClient(data.user);
            set({ user, token, loading: false });
          } else {
            Cookies.remove('auth_token');
            set({ user: null, token: null, loading: false });
          }
        } catch (error) {
          Cookies.remove('auth_token');
          set({ user: null, token: null, loading: false });
        }
      },
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

          const user = mapServerUserToClient(data.user);
          Cookies.set('auth_token', data.token, {
            expires: 1,
            secure: true,
            sameSite: 'lax'
          });
          
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

          // Stocker le token dans un cookie
          Cookies.set('auth_token', data.token, {
            expires: 1,
            secure: true,
            sameSite: 'lax'
          });
          
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

      signOut: async () => {
        try {
          set({ loading: true });
          const token = Cookies.get('auth_token');
          if (token) {
            await fetch('http://localhost:3000/api/auth/signout', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          }
          Cookies.remove('auth_token');
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
      partialize: (state) => ({ 
        user: state.user
      })
    }
  )
);