'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType } from '@/types/auth';
import {
  getAuthToken,
  getUserInfo,
  setAuthToken,
  setUserInfo,
  clearAuth
} from '@/lib/auth-utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从 cookies 读取 token
    const getTokenFromCookie = () => {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'auth_token') {
          return decodeURIComponent(value);
        }
      }
      return null;
    };
    
    const token = getTokenFromCookie();
    const userInfo = getUserInfo();
    
    if (token && userInfo) {
      setUser(userInfo);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || '登录失败');
    }

    const token = generateToken(username);
    // 设置 cookie
    document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=86400`;
    setAuthToken(token);
    setUserInfo(data.user);
    setUser(data.user);
  };

  const logout = async (): Promise<void> => {
    clearAuth();
    // 清除 cookie
    document.cookie = 'auth_token=; path=/; max-age=0';
    setUser(null);
    window.location.href = '/login';
  };

  const updatePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
    if (!user) {
      throw new Error('未登录');
    }

    const response = await fetch('/api/auth/update-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: user.username,
        oldPassword,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || '密码修改失败');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function generateToken(username: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2);
  return Buffer.from(`${username}:${timestamp}:${randomStr}`).toString('base64');
}
