import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm]         = useState({ username: '', password: '' });
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(form.username, form.password);
    setLoading(false);
    if (!result.success) setError(result.error || 'Login failed.');
  };

  const quickLogin = (role) => {
    const map = {
      admin:     { username: 'admin',     password: 'admin123'   },
      security1: { username: 'security1', password: 'sec123'     },
      student1:  { username: 'student1',  password: 'student123' },
    };
    setForm(map[role]);
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow" />
      <div className="login-bg-glow-2" />

      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="login-logo-wrap">
            <Shield size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            CampusShield <span style={{ color: '#FDB913' }}>AI</span>
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
            KNUST Real-Time Crime Hotspot Prediction System
          </p>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.15rem', fontStyle: 'italic' }}>
            Kwame Nkrumah University of Science &amp; Technology, Kumasi
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <Lock size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="username"
                name="username"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '2.25rem', paddingRight: '2.5rem' }}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                aria-label="Toggle password visibility"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            style={{ marginTop: '0.25rem' }}
            disabled={loading}
          >
            {loading ? (
              <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in…</>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Quick Access */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Demo Quick Access
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { key: 'admin',     label: 'Admin',    badge: 'badge-admin' },
              { key: 'security1', label: 'Security', badge: 'badge-security' },
              { key: 'student1',  label: 'Student',  badge: 'badge-student' },
            ].map(({ key, label, badge }) => (
              <button
                key={key}
                type="button"
                onClick={() => quickLogin(key)}
                className="btn btn-ghost btn-sm"
                style={{ flex: 1, fontSize: '0.75rem' }}
              >
                <span className={`badge ${badge}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
