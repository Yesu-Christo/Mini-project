import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const routeTitles = {
  '/':           'Real-Time Security Dashboard',
  '/report':     'Report Security Incident',
  '/incidents':  'Incident History & Logs',
  '/prediction': 'AI Crime Risk Prediction',
  '/heatmap':    'GIS Campus Crime Heatmap',
  '/alerts':     'Live Emergency Alerts',
  '/users':      'User Management',
  '/profile':    'My Profile',
  '/settings':   'System Settings',
};

export default function Navbar({ onMenuToggle }) {
  const { user } = useAuth();
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'CampusShield AI';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-menu-btn btn btn-icon btn-ghost"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {title}
          </h1>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1 }}>
            Kwame Nkrumah University of Science &amp; Technology
          </p>
        </div>
      </div>

      <div className="navbar-right">
        <span className="status-dot">System Active</span>

        <button className="btn btn-icon btn-ghost" aria-label="Notifications">
          <Bell size={16} />
        </button>

        <div className="user-chip">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
