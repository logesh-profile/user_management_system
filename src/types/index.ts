export interface User {
  id: string;
  fullname: string;
  email: string;
  profileImage?: string;
  profileImagePublicId?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  total: number;
  admins: number;
  blocked: number;
  active: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  initializing: boolean;
  error: string | null;
}

export interface UsersState {
  users: User[];
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
