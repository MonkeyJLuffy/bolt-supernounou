export type UserRole = 'parent' | 'nounou' | 'gestionnaire' | 'admin';

// Interface pour les données utilisateur côté client
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  firstLogin?: boolean;
}

// Interface pour les données utilisateur côté serveur
export interface ServerUser {
  id: string;
  email: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  created_at: string;
  first_login?: boolean;
}

// Interface pour la réponse d'authentification
export interface AuthResponse {
  user: User;
  token: string;
}

// Interface pour l'état d'authentification
export interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, firstName: string, lastName: string) => Promise<AuthResponse>;
  setDemoUser: (user: User) => void;
  updateProfile: (data: {
    firstName: string;
    lastName: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<User>;
}

// Interface pour les props du formulaire d'authentification
export interface AuthFormProps {
  type: 'signin' | 'signup';
}

// Interface pour les identifiants de connexion
export interface SignInCredentials {
  email: string;
  password: string;
}

// Interface pour les données d'inscription
export interface SignUpCredentials extends SignInCredentials {
  role: UserRole;
  firstName: string;
  lastName: string;
}

// Fonction utilitaire pour mapper les données serveur vers le client
export function mapServerUserToClient(serverUser: ServerUser): User {
  // Vérification du rôle
  if (!['admin', 'parent', 'nounou', 'gestionnaire'].includes(serverUser.role)) {
    throw new Error('Rôle invalide');
  }

  return {
    id: serverUser.id,
    email: serverUser.email,
    role: serverUser.role as UserRole,
    firstName: serverUser.first_name,
    lastName: serverUser.last_name,
    createdAt: new Date(serverUser.created_at),
    firstLogin: serverUser.first_login ?? false,
  };
}