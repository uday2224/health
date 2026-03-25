import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (phone: string, otp: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export interface RegisterData {
  name: string;
  email?: string;
  phone: string;
  role: 'patient' | 'nurse' | 'admin';
  address?: string;
  bloodGroup?: string;
  licenseNumber?: string;
  specializations?: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // In real app, verify token with backend
          const userData = localStorage.getItem('user_data');
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (phone: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      // Mock login - replace with actual Supabase Auth call
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: `user@tezhealth.com`,
        phone,
        name: 'Test User',
        role: 'patient',
        created_at: new Date().toISOString(),
      };

      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      // Mock registration - replace with actual Supabase Auth call
      const mockUser: User = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        email: data.email || `${data.phone}@tezhealth.com`,
        phone: data.phone,
        name: data.name,
        role: data.role,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
