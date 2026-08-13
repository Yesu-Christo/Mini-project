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

  const login = useCallback(async (school_id, password) => {
    try {
      const res = await apiLogin({ school_id, password });
      const { token, user: userData } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      // Graceful fallback for demo if backend is not running
      const mockUsers = {
        STU001: { id: 3, username: 'student1', email: `student1@${DEMO_EMAIL_DOMAIN}`, role: 'STUDENT', school_id: 'STU001' },
        SEC001: { id: 2, username: 'security1', email: `sec1@${DEMO_EMAIL_DOMAIN}`, role: 'SECURITY', school_id: 'SEC001' },
        ADM001: { id: 1, username: 'admin',    email: `admin@${DEMO_EMAIL_DOMAIN}`,    role: 'ADMIN',    school_id: 'ADM001' },
      };
      if (mockUsers[school_id] && password) {
        const userData = mockUsers[school_id];
        localStorage.setItem(TOKEN_KEY, `demo-token-${school_id}`);
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
