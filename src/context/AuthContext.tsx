'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, getProfile } from '../lib/api';
import { getToken, setToken, removeToken } from '../lib/auth';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  attendances?: any[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setToken(res.access_token);
    setUser(res.user);
  };

  const register = async (data: RegisterData) => {
    const res = await apiRegister(data);
    setToken(res.access_token);
    setUser(res.user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
