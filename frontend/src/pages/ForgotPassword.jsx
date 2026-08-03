import React, { useState } from 'react';

export default function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.5rem' }}>Reset Password</h2>
        {submitted ? (
          <div style={{ color: 'var(--accent-green)', padding: '1rem 0' }}>
            Password reset instructions have been sent to <b>{email}</b>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>KNUST Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
}
