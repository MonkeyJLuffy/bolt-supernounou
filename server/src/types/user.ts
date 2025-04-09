export type UserRole = 'admin' | 'gestionnaire' | 'nounou' | 'parent';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  is_active: boolean;
}

export interface UserCreateInput {
  email: string;
  password: string;
  role: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
}

export interface UserUpdateInput {
  email?: string;
  password?: string;
  role?: UserRole;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  is_active?: boolean;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
} 