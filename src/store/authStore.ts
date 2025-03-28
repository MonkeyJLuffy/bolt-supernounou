import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { AuthState, UserRole, User } from '../types/auth';

export const useAuthStore = create<AuthState>((set) => {
  // Initialiser la session au démarrage
  supabase.auth.getSession().then(({ data: { session }, error }) => {
    if (error) {
      console.error('Erreur lors de la récupération de la session:', error.message);
      set({ user: null, loading: false });
      return;
    }

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
  }).catch((error) => {
    console.error('Erreur inattendue:', error);
    set({ user: null, loading: false });
  });

  // Écouter les changements d'authentification
  supabase.auth.onAuthStateChange((_event, session) => {
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
        set({ loading: true, error: null });
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } catch (error) {
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
        set({ loading: true, error: null });
        const { error } = await supabase.auth.signUp({
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

        if (error) throw error;
      } catch (error) {
        set({ error: (error as Error).message });
        localStorage.clear();
        set({ user: null });
      } finally {
        set({ loading: false });
      }
    },

    signOut: async () => {
      try {
        set({ loading: true, error: null });
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        // Nettoyer le localStorage et réinitialiser l'état
        localStorage.clear();
        set({ user: null });
      } catch (error) {
        set({ error: (error as Error).message });
      } finally {
        set({ loading: false });
      }
    },
  };
});