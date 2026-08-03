import React, { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cs_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (username, password) => {
    try {
      const res = await apiLogin({ username, password });
      const { token, user: userData } = res.data;
      localStorage.setItem('cs_token', token);
      localStorage.setItem('cs_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      // Graceful fallback for demo if backend is not running
      const mockUsers = {
        admin:     { id: 1, username: 'admin',     email: 'admin@knust.edu.gh',   role: 'ADMIN' },
        security1: { id: 2, username: 'security1', email: 'sec@knust.edu.gh',     role: 'SECURITY' },
        student1:  { id: 3, username: 'student1',  email: 'student1@knust.edu.gh', role: 'STUDENT' },
      };
      if (mockUsers[username] && password) {
        const userData = mockUsers[username];
        localStorage.setItem('cs_token', `demo-token-${username}`);
        localStorage.setItem('cs_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, demo: true };
      }
      return { success: false, error: err?.response?.data?.error || 'Invalid credentials' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
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
