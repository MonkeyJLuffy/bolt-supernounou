export type UserRole = 'admin' | 'parent' | 'nounou' | 'gestionnaire';

// Interface pour les données utilisateur côté client
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
}

// Interface pour les données utilisateur côté serveur
export interface ServerUser {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

// Interface pour la réponse d'authentification
export interface AuthResponse {
  user: ServerUser;
  token: string;
}

// Interface pour l'état d'authentification
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, role: UserRole, firstName: string, lastName: string) => Promise<AuthResponse>;
  checkAuth: () => Promise<void>;
  signOut: () => void;
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
export interface SignUpData extends SignInCredentials {
  role: UserRole;
  firstName: string;
  lastName: string;
}

// Fonction utilitaire pour mapper les données serveur vers le client
export function mapServerUserToClient(serverUser: ServerUser): User {
  return {
    id: serverUser.id,
    email: serverUser.email,
    role: serverUser.role,
    firstName: serverUser.firstName,
    lastName: serverUser.lastName,
    createdAt: new Date().toISOString()
  };
}