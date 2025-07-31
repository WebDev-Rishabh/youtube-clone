// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Sidebar.css'; 

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <ul className="sidebar__list">
        <li><Link to="/">Home</Link></li>
      
        <li><Link to="/channels">Your Channels</Link></li>
        <li><Link to="/create-channel" className="sidebar__create">+ Create Channel</Link></li>
      </ul>
    </nav>
  );
}
