import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar  from '../components/Navbar';
import Footer  from '../components/Footer';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 199, backdropFilter: 'blur(4px)'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-wrapper">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <main className="page-body">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
