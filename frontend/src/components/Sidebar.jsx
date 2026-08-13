import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, AlertTriangle, ClipboardList, BrainCircuit,
  Map, Bell, Users, UserCircle, Settings, Shield, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/',           label: 'Dashboard',        icon: LayoutDashboard, end: true },
  { to: '/report',     label: 'Report Incident',  icon: AlertTriangle },
  { to: '/incidents',  label: 'Incident History', icon: ClipboardList },
  { to: '/prediction', label: 'AI Predictions',   icon: BrainCircuit },
  { to: '/heatmap',    label: 'Crime Heatmap',    icon: Map },
];
const alertItem = { to: '/alerts', label: 'Live Alerts', icon: Bell };

const adminItems = [
  { to: '/users',    label: 'User Management', icon: Users },
];

const accountItems = [
  { to: '/profile',  label: 'My Profile', icon: UserCircle },
  { to: '/settings', label: 'Settings',   icon: Settings },
];

function NavGroup({ title, items }) {
  return (
    <>
      <p className="sidebar-section-label">{title}</p>
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <Icon className="nav-icon" size={16} />
          {label}
        </NavLink>
      ))}
    </>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Shield size={18} color="#fff" />
        </div>
        <div className="sidebar-logo-text">
          <strong>CampusShield <span style={{ color: '#FDB913' }}>AI</span></strong>
          <span>KNUST Security Platform</span>
        </div>
        {/* Mobile close */}
        <button
          onClick={onClose}
          className="btn btn-icon btn-ghost"
          style={{ marginLeft: 'auto', display: 'none' }}
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavGroup title="Main" items={[...navItems, ...(user?.role !== 'STUDENT' ? [alertItem] : [])]} />
        {user?.role === 'ADMIN' && <NavGroup title="Admin" items={adminItems} />}
        <NavGroup title="Account" items={accountItems} />
      </nav>

      {/* User chip at bottom */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.25rem' }}>
          <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ fontSize: '0.8rem' }}>{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button
            onClick={logout}
            className="btn btn-icon btn-ghost btn-sm"
            title="Logout"
            aria-label="Logout"
            style={{ flexShrink: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
