import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '65vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <SearchX size={56} style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }} />
      <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--blue)', lineHeight: 1, marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: 360, marginBottom: '2rem', lineHeight: 1.6 }}>
        The security clearance for this page could not be verified, or this section does not exist.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        <Home size={15} /> Return to Dashboard
      </Link>
    </div>
  );
}
