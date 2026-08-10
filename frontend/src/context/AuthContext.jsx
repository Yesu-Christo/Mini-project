import React, { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../services/api';

// ---------------------------------------------------------------------------
// Configuration — read from environment variables (set in frontend/.env)
// ---------------------------------------------------------------------------
const TOKEN_KEY         = import.meta.env.VITE_TOKEN_KEY         || 'cs_token';
const USER_KEY          = import.meta.env.VITE_USER_KEY          || 'cs_user';
const DEMO_EMAIL_DOMAIN = import.meta.env.VITE_DEMO_EMAIL_DOMAIN || 'knust.edu.gh';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (username, password) => {
    try {
      const res = await apiLogin({ username, password });
      const { token, user: userData } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      // Graceful fallback for demo if backend is not running
      const mockUsers = {
        admin:     { id: 1, username: 'admin',     email: `admin@${DEMO_EMAIL_DOMAIN}`,    role: 'ADMIN' },
        security1: { id: 2, username: 'security1', email: `sec@${DEMO_EMAIL_DOMAIN}`,      role: 'SECURITY' },
        student1:  { id: 3, username: 'student1',  email: `student1@${DEMO_EMAIL_DOMAIN}`, role: 'STUDENT' },
      };
      if (mockUsers[username] && password) {
        const userData = mockUsers[username];
        localStorage.setItem(TOKEN_KEY, `demo-token-${username}`);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        setUser(userData);
        return { success: true, demo: true };
      }
      return { success: false, error: err?.response?.data?.error || 'Invalid credentials' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
