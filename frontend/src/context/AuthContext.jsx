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
    // Demo credentials — always available regardless of backend state
    const DEMO_PASSWORDS = {
      STU001: 'student123',
      SEC001: 'sec123',
      ADM001: 'admin123',
      STF001: 'staff123',
      IT001:  'it123',
    };
    const DEMO_USERS = {
      STU001: { id: 3, username: 'student1',  email: `student1@${DEMO_EMAIL_DOMAIN}`,  role: 'STUDENT',  school_id: 'STU001' },
      SEC001: { id: 2, username: 'security1', email: `sec1@${DEMO_EMAIL_DOMAIN}`,      role: 'SECURITY', school_id: 'SEC001' },
      ADM001: { id: 1, username: 'admin',     email: `admin@${DEMO_EMAIL_DOMAIN}`,     role: 'ADMIN',    school_id: 'ADM001' },
      STF001: { id: 4, username: 'staff1',    email: `staff1@${DEMO_EMAIL_DOMAIN}`,    role: 'STAFF',    school_id: 'STF001' },
      IT001:  { id: 5, username: 'it1',       email: `it1@${DEMO_EMAIL_DOMAIN}`,       role: 'IT',       school_id: 'IT001'  },
    };

    const sid = school_id.trim().toUpperCase();

    try {
      const res = await apiLogin({ school_id: sid, password });
      const { token, user: userData } = res.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      // If backend is unreachable OR the demo ID isn't in the DB yet,
      // fall back to the hardcoded demo credentials so the presentation
      // always works regardless of backend/DB state.
      const isNetworkError = !err.response;
      const isNotFound = err?.response?.status === 403
        && err?.response?.data?.error?.toLowerCase().includes('not found');

      if ((isNetworkError || isNotFound) && DEMO_USERS[sid] && DEMO_PASSWORDS[sid] === password) {
        const userData = DEMO_USERS[sid];
        localStorage.setItem(TOKEN_KEY, sid);
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
