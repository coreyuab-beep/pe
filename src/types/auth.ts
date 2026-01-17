export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  message: string;
}

export interface UpdatePasswordRequest {
  username: string;
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}
