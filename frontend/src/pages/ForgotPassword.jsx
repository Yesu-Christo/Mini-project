import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
  const [schoolId, setSchoolId] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus(null);

    try {
      await forgotPassword({ school_id: schoolId });
      setStatus('A password reset link has been sent if the School ID exists.');
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to send reset instructions.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.75rem' }}>Reset Password</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Enter your School ID to receive reset instructions.
        </p>

        {status && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>{status}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>School ID</label>
            <input
              type="text"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              required
              placeholder="STU1234"
              style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff' }}
            />
          </div>

          <button type="submit" className="btn btn-primary">Send Reset Link</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/login')}>Back to Login</button>
        </form>
      </div>
    </div>
  );
}
