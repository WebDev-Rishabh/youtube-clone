// src/components/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {open && <Sidebar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onToggleSidebar={() => setOpen(o => !o)} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          <Outlet /> {/* This is where Home, VideoPage, etc. appear */}
        </main>
      </div>
    </div>
  );
}
