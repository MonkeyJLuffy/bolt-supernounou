export type UserRole = 'parent' | 'nounou' | 'gestionnaire' | 'admin';

// Interface pour les données utilisateur côté client
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

// Interface pour les données utilisateur côté serveur
export interface ServerUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
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
  signUp: (email: string, password: string, role: UserRole, firstName: string, lastName: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  setDemoUser: (user: User) => void;
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
  return {
    ...serverUser,
    createdAt: new Date(serverUser.createdAt),
  };
}