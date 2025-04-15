import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, AuthResponse, User, UserRole, mapServerUserToClient } from '../types/auth';
import Cookies from 'js-cookie';

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

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
            console.log('API Response:', data);
            const user = mapServerUserToClient(data.user);
            console.log('Mapped User:', user);
            if (!['admin', 'parent', 'nounou', 'gestionnaire'].includes(user.role)) {
              throw new Error('Rôle invalide');
            }
            set({ user, token, loading: false });
          } else {
            Cookies.remove('auth_token');
            set({ user: null, token: null, loading: false });
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'authentification:', error);
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

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la connexion');
          }

          const data = await response.json();
          const user = mapServerUserToClient(data.user);
          const token = data.token;

          Cookies.set('auth_token', token, { expires: 1 });
          set({ user, token, loading: false, error: null });

          return { user, token };
        } catch (error) {
          console.error('Erreur lors de la connexion:', error);
          set({ loading: false, error: error instanceof Error ? error.message : 'Une erreur est survenue' });
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
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              credentials: 'include',
            });
          }
          Cookies.remove('auth_token');
          set({ user: null, token: null, loading: false, error: null });
        } catch (error) {
          set({ loading: false, error: error instanceof Error ? error.message : 'Une erreur est survenue' });
        }
      },
      signUp: async (email: string, password: string, role: UserRole, firstName: string, lastName: string): Promise<AuthResponse> => {
        try {
          set({ loading: true, error: null });
          const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password, role, firstName, lastName }),
          });

          if (!response.ok) {
            throw new Error('Erreur lors de l\'inscription');
          }

          const data = await response.json();
          const user = mapServerUserToClient(data.user);
          const token = data.token;

          Cookies.set('auth_token', token, { expires: 1 });
          set({ user, token, loading: false, error: null });

          return { user, token };
        } catch (error) {
          set({ loading: false, error: error instanceof Error ? error.message : 'Une erreur est survenue' });
          throw error;
        }
      },
      setDemoUser: (user: User) => {
        set({ user, loading: false, error: null });
      },
      updateProfile: async (data) => {
        const token = Cookies.get('auth_token');
        if (!token) {
          throw new Error('Non authentifié');
        }

        if (data.newPassword && data.newPassword.length < 8) {
          throw new Error('Le mot de passe doit contenir au moins 8 caractères');
        }

        try {
          set({ loading: true });
          const response = await fetch('http://localhost:3000/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({
              first_name: data.firstName,
              last_name: data.lastName,
              current_password: data.currentPassword,
              new_password: data.newPassword,
              first_login: false,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de la mise à jour du profil');
          }

          const userData = await response.json();
          const updatedUser = mapServerUserToClient(userData.user);
          
          // Mettre à jour le token si présent
          if (userData.token) {
            Cookies.set('auth_token', userData.token, { expires: 1 });
            set({ user: updatedUser, token: userData.token, loading: false });
          } else {
            set({ user: updatedUser, loading: false });
          }
          
          return updatedUser;
        } catch (error) {
          console.error('Erreur lors de la mise à jour du profil:', error);
          set({ loading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);