export type UserRole = 'parent' | 'nounou' | 'gestionnaire' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, firstName: string, lastName: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  signOut: () => void;
}