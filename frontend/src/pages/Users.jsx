import React, { useState } from 'react';
import Table from '../components/Table';
import { UserPlus, Search } from 'lucide-react';

const USERS = [
  { id: 1, username: 'admin',     email: 'admin@knust.edu.gh',    role: 'ADMIN',    hall: 'Administration Block',    status: 'Active' },
  { id: 2, username: 'security1', email: 'sec@knust.edu.gh',      role: 'SECURITY', hall: 'Security Command Centre', status: 'Active' },
  { id: 3, username: 'student1',  email: 'std1@knust.edu.gh',     role: 'STUDENT',  hall: 'Unity Hall',              status: 'Active' },
  { id: 4, username: 'student2',  email: 'std2@knust.edu.gh',     role: 'STUDENT',  hall: 'Africa Hall',             status: 'Active' },
  { id: 5, username: 'security2', email: 'sec2@knust.edu.gh',     role: 'SECURITY', hall: 'Brunei Patrol Unit',      status: 'Active' },
];

export default function Users() {
  const [search, setSearch] = useState('');

  const filtered = USERS.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">User Management</h2>
          <p className="page-subtitle">Manage student, security personnel, and admin accounts.</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={15} /> Invite User
        </button>
      </div>

      <div className="card">
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '1.25rem', maxWidth: 320 }}>
          <Search size={14} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="search"
            className="form-control"
            style={{ paddingLeft: '2.2rem' }}
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Table
          headers={['#', 'Username', 'Email', 'Role', 'Hall / Dept.', 'Status']}
          data={filtered}
          renderRow={(u, i) => (
            <tr key={i}>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{u.id}</td>
              <td style={{ fontWeight: 700 }}>{u.username}</td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
              <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{u.hall}</td>
              <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--green)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                  {u.status}
                </span>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
