import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form,    setForm]    = useState({ school_id: '', password: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.school_id.trim() || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(form.school_id.trim(), form.password);
    setLoading(false);
    if (!result.success) setError(result.error || 'Login failed.');
  };

  // Quick-access sets school_id (not username)
  const quickLogin = (role) => {
    const map = {
      admin:     { school_id: 'ADM001', password: 'admin123'   },
      security1: { school_id: 'SEC001', password: 'sec123'     },
      student1:  { school_id: 'STU001', password: 'student123' },
      staff1:    { school_id: 'STF001', password: 'staff123'   },
      it1:       { school_id: 'IT001',  password: 'it123'      },
    };
    setForm(map[role] || { school_id: '', password: '' });
    setError('');
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
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* School ID — name must match state key */}
          <div className="form-group">
            <label className="form-label" htmlFor="school_id">School ID</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                id="school_id"
                name="school_id"
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="e.g. STU001, SEC001, ADM001"
                value={form.school_id}
                onChange={handleChange}
                autoComplete="username"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Password */}
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
            {loading
              ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Signing in…</>
              : 'Sign In'
            }
          </button>

          <button type="button" className="btn btn-ghost btn-full" onClick={() => navigate('/forgot-password')}>
            Forgot Password?
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-full"
            style={{ color: 'var(--text-primary)', borderColor: 'transparent', fontWeight: 600 }}
            onClick={() => navigate('/register')}
          >
            Don't have an account? <span style={{ textDecoration: 'underline' }}>Register</span>
          </button>
        </form>

        {/* Quick Access */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
            Demo Quick Access
          </p>
          <div className="quick-access-grid">
            {[
              { key: 'admin',     label: 'Admin',    badge: 'badge-admin'    },
              { key: 'security1', label: 'Security', badge: 'badge-security' },
              { key: 'student1',  label: 'Student',  badge: 'badge-student'  },
              { key: 'staff1',    label: 'Staff',    badge: 'badge-security' },
              { key: 'it1',       label: 'IT',       badge: 'badge-security' },
            ].map(({ key, label, badge }) => (
              <button
                key={key}
                type="button"
                onClick={() => quickLogin(key)}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.75rem' }}
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
