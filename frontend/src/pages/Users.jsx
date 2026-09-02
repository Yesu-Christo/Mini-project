import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { UserPlus, Search, RefreshCw } from 'lucide-react';
import { getUsers } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ROLE_COLORS = {
  ADMIN:    'badge-admin',
  SECURITY: 'badge-security',
  STUDENT:  'badge-student',
  STAFF:    'badge-staff',
  IT:       'badge-it',
};

export default function Users() {
  const { user } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [search,  setSearch]  = useState('');

  const fetchUsers = () => {
    setLoading(true);
    setError('');
    getUsers()
      .then(res => setUsers(res.data.users || []))
      .catch(err => {
        const msg = err?.response?.data?.error;
        const code = err?.response?.status;
        if (code === 401 || code === 403) {
          setError('You do not have permission to view user accounts.');
        } else {
          setError(msg || 'Failed to load users. Please try again.');
        }
      })
      .finally(() => setLoading(false));
  };

  // Fetch fresh from the backend on every mount — no cache layer
  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase()) ||
    u.school_id.toLowerCase().includes(search.toLowerCase()) ||
    (u.first_name + ' ' + u.last_name).toLowerCase().includes(search.toLowerCase())
  );

  // "Invite User" — no backend invite endpoint exists yet; button is
  // visible to admins but shows a clear message instead of a broken action.
  const canManage = user?.role === 'ADMIN';

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">User Management</h2>
          <p className="page-subtitle">
            All registered campus accounts
            {!loading && !error && (
              <span style={{ marginLeft: '0.75rem', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--r-full)', padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                {filtered.length} of {users.length}
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={fetchUsers}
            title="Refresh users"
            aria-label="Refresh"
            disabled={loading}
          >
            <RefreshCw size={14} />
          </button>
          {canManage && (
            <button
              className="btn btn-primary"
              disabled
              title="Invite-by-email endpoint not yet implemented"
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            >
              <UserPlus size={15} /> Invite User
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <div className="card">
        <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="search"
            className="form-control"
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Search by name, ID, email, role…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Table
          headers={['School ID', 'Name', 'Email', 'Role', 'Hall / Dept.', 'Joined', 'Status']}
          data={filtered}
          loading={loading}
          renderRow={(u, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 700, color: 'var(--blue)', fontSize: '0.82rem' }}>{u.school_id}</td>
              <td style={{ fontWeight: 600 }}>
                {u.title ? `${u.title} ` : ''}{u.first_name} {u.last_name}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>@{u.username}</div>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
              <td>
                <span className={`badge ${ROLE_COLORS[u.role] || 'badge-student'}`}>{u.role}</span>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {u.hall_or_department || u.program || '—'}
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {u.date_joined?.slice(0, 10)}
              </td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 600, color: u.is_active ? 'var(--green)' : 'var(--red)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.is_active ? 'var(--green)' : 'var(--red)', display: 'inline-block' }} />
                  {u.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
