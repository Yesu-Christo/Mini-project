import React, { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_BADGE = { ADMIN: 'badge-admin', SECURITY: 'badge-security', STAFF: 'badge-security', IT: 'badge-security', STUDENT: 'badge-student' };

export default function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullname:   [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'CampusShield User',
    email:      user?.email || 'admin@knust.edu.gh',
    phone:      '+233 20 000 0001',
    title:      user?.title || '',
    otherName:  user?.other_name || '',
    department: user?.hall_or_department || 'Not provided',
    program:    user?.program || '',
    occupation: user?.occupation || '',
    studentId:  user?.school_id || 'Not provided',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Field = ({ label, fieldKey, type = 'text' }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {editing ? (
        <input
          type={type}
          className="form-control"
          value={profile[fieldKey]}
          onChange={e => setProfile(p => ({ ...p, [fieldKey]: e.target.value }))}
        />
      ) : (
        <div style={{ padding: '0.65rem 0', color: 'var(--text-primary)', fontSize: '0.9rem', borderBottom: '1px solid var(--border)' }}>
          {profile[fieldKey]}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div className="page-header">
        <div>
          <h2 className="page-title">My Profile</h2>
          <p className="page-subtitle">Manage your CampusShield AI account details.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {editing ? (
            <>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}><X size={14} /> Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Save Changes</button>
            </>
          ) : (
            <button className="btn btn-ghost" onClick={() => setEditing(true)}><Edit2 size={14} /> Edit Profile</button>
          )}
        </div>
      </div>

      {saved && (
        <div className="alert alert-success" style={{ marginBottom: '1.25rem' }}>
          Profile updated successfully.
        </div>
      )}

      <div className="card">
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #006B3F, #FDB913)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.75rem', fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>
            {profile.fullname.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>{profile.fullname}</h3>
            <span className={`badge ${ROLE_BADGE[user?.role] || 'badge-student'}`}>{user?.role}</span>
          </div>
        </div>

        <div className="form-grid-2">
          <Field label="Full Name" fieldKey="fullname" />
          <Field label="Other Name" fieldKey="otherName" />
          <Field label="KNUST Email" fieldKey="email" type="email" />
          <Field label="Phone Number" fieldKey="phone" />
          <Field label="Staff / Student ID" fieldKey="studentId" />
          {user?.role === 'STUDENT' && <Field label="Program of Study" fieldKey="program" />}
          {user?.role !== 'STUDENT' && <Field label="Title" fieldKey="title" />}
          {user?.role !== 'STUDENT' && <Field label="Occupation" fieldKey="occupation" />}
          <Field label="Department / Hall" fieldKey="department" />
        </div>
      </div>
    </div>
  );
}
