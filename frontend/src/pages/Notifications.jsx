import React from 'react';
import { Bell, RefreshCw, ClipboardCheck } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export default function Notifications() {
  const { notifications, loadingAll, refreshAll } = useAppData();

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="page-subtitle">Updates about incident reports and review status changes.</p>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={refreshAll} title="Refresh" aria-label="Refresh notifications">
          <RefreshCw size={15} />
        </button>
      </div>

      {loadingAll ? (
        <div className="center-flex"><div className="spinner" /></div>
      ) : notifications.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: 760 }}>
          {notifications.map((notification) => (
            <div key={notification.id} className="card card-sm" style={{ borderLeft: '3px solid var(--blue)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <ClipboardCheck size={16} color="var(--blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{notification.title}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>{notification.created_at}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '0.35rem' }}>{notification.message}</p>
                  {notification.location_name && (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.35rem' }}>
                      Location: {notification.location_name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card center-flex" style={{ minHeight: 180, color: 'var(--text-muted)' }}>
          <Bell size={32} style={{ opacity: 0.35 }} />
          <span>No notifications yet.</span>
        </div>
      )}
    </div>
  );
}
