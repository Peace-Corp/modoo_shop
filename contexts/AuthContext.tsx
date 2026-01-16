'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { getUserByEmail } from '@/data/users';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('modoo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const foundUser = await getUserByEmail(email);
      if (foundUser) {
        // In a real app, you'd validate the password here
        setUser(foundUser);
        localStorage.setItem('modoo_user', JSON.stringify(foundUser));
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch {
      return { success: false, error: 'An error occurred during sign in' };
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      // Create new user locally (in production, this would use Supabase Auth)
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'user',
        createdAt: new Date().toISOString().split('T')[0],
      };

      setUser(newUser);
      localStorage.setItem('modoo_user', JSON.stringify(newUser));
      return { success: true };
    } catch {
      return { success: false, error: 'An error occurred during sign up' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('modoo_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAdmin,
      }}
    >
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
