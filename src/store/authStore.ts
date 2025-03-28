import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, UserRole, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => {
  // Initialiser la session au démarrage
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.error('Erreur lors de la récupération de la session:', error.message);
      console.error('Détails de l\'erreur:', error);
      set({ user: null, loading: false });
      return;
    }

    if (session?.user) {
      console.log('Session trouvée:', session);
      const user: User = {
        id: session.user.id,
        email: session.user.email ?? '',
        role: (session.user.user_metadata?.role || 'parent') as UserRole,
        firstName: session.user.user_metadata?.firstName || '',
        lastName: session.user.user_metadata?.lastName || '',
        createdAt: session.user.created_at,
      };
      set({ user, loading: false });
    } else {
      console.log('Aucune session trouvée');
      set({ user: null, loading: false });
    }
  }).catch((error) => {
    console.error('Erreur inattendue:', error);
    set({ user: null, loading: false });
  });

  // Écouter les changements d'authentification
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Changement d\'état d\'authentification:', event, session);
    if (session?.user) {
      const user: User = {
        id: session.user.id,
        email: session.user.email ?? '',
        role: (session.user.user_metadata?.role || 'parent') as UserRole,
        firstName: session.user.user_metadata?.firstName || '',
        lastName: session.user.user_metadata?.lastName || '',
        createdAt: session.user.created_at,
      };
      set({ user, loading: false });
    } else {
      set({ user: null, loading: false });
    }
  });

  return {
    user: null,
    loading: true,
    error: null,

    signIn: async (email: string, password: string) => {
      try {
        console.log('Tentative de connexion pour:', email);
        set({ loading: true, error: null });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error('Erreur de connexion:', error.message);
          console.error('Détails de l\'erreur:', error);
          throw error;
        }

        console.log('Connexion réussie:', data);
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        set({ error: (error as Error).message });
        // En cas d'erreur, on s'assure que l'utilisateur est déconnecté
        localStorage.clear();
        set({ user: null });
      } finally {
        set({ loading: false });
      }
    },

    signUp: async (email: string, password: string, role: UserRole, firstName: string, lastName: string) => {
      try {
        console.log('Tentative d\'inscription pour:', email);
        set({ loading: true, error: null });
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              firstName,
              lastName,
            },
          },
        });

        if (error) {
          console.error('Erreur d\'inscription:', error.message);
          console.error('Détails de l\'erreur:', error);
          throw error;
        }

        console.log('Inscription réussie:', data);
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        set({ error: (error as Error).message });
        localStorage.clear();
        set({ user: null });
      } finally {
        set({ loading: false });
      }
    },

    signOut: async () => {
      try {
        console.log('Tentative de déconnexion');
        set({ loading: true, error: null });
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Erreur de déconnexion:', error.message);
          console.error('Détails de l\'erreur:', error);
          throw error;
        }
        
        console.log('Déconnexion réussie');
        // Nettoyer le localStorage et réinitialiser l'état
        localStorage.clear();
        set({ user: null });
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        set({ error: (error as Error).message });
      } finally {
        set({ loading: false });
      }
    },

    simulateUser: (role: UserRole = 'parent') => {
      const users: Record<UserRole, {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        createdAt: string;
      }> = {
        parent: {
          id: 'simulated-parent-id',
          email: 'marie.dupont@gmail.com',
          firstName: 'Marie',
          lastName: 'Dupont',
          role: 'parent',
          createdAt: new Date().toISOString(),
        },
        nounou: {
          id: 'simulated-nounou-id',
          email: 'sophie.martin@gmail.com',
          firstName: 'Sophie',
          lastName: 'Martin',
          role: 'nounou',
          createdAt: new Date().toISOString(),
        },
        gestionnaire: {
          id: 'simulated-gestionnaire-id',
          email: 'lucas.bernard@gmail.com',
          firstName: 'Lucas',
          lastName: 'Bernard',
          role: 'gestionnaire',
          createdAt: new Date().toISOString(),
        },
        admin: {
          id: 'simulated-admin-id',
          email: 'admin@supernounou.com',
          firstName: 'Admin',
          lastName: 'System',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
      };

      const simulatedUser = users[role];

      // Simuler une session Supabase
      localStorage.setItem('sb-sjudvjlqwgcsyzeenkdb-auth-token', JSON.stringify({
        access_token: 'simulated-token',
        refresh_token: 'simulated-refresh-token',
        expires_in: 3600,
        expires_at: Date.now() + 3600 * 1000,
        user: {
          id: simulatedUser.id,
          email: simulatedUser.email,
          user_metadata: {
            role: simulatedUser.role,
            firstName: simulatedUser.firstName,
            lastName: simulatedUser.lastName,
          },
          created_at: simulatedUser.createdAt,
        },
      }));

      set({
        user: simulatedUser,
        loading: false,
      });
    },
  };
});