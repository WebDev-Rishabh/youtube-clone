// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaBars,
  FaMicrophone,
  FaVideo,
  FaSearch,
  FaPlusCircle,
  FaChevronDown,
} from 'react-icons/fa';
import { logout } from '../redux/authSlice'; 
import './Header.css';

export default function Header({ onToggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState(
    new URLSearchParams(location.search).get('query') || ''
  );
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__left">
        <button onClick={onToggleSidebar} className="header__burger">
          <FaBars />
        </button>
        <Link to="/" className="header__logoLink" >
        <img className="yt-logo"
              src={
                
                  ' http://localhost:5000/uploads/yt.jpg'
              }
              alt="Avatar"
              
        
            />
          
        </Link>
      </div>

      

      <div className="header__right">
        {user && (
          <>
            <FaPlusCircle
              className="icon"
              title="Create Channel"
              onClick={() => navigate('/create-channel')}
            />
            <FaVideo
              className="icon"
              title="Upload Video"
              onClick={() => navigate('/upload')}
            />
          </>
        )}

        <div className="header__avatarWrapper" onClick={toggleDropdown}>
          {user ? (
            <img
              src={
                user.avatar?.startsWith('http')
                  ? user.avatar
                  : `http://localhost:5000${user.avatar}`
              }
              alt="Avatar"
              className="header__avatar"
            />
          ) : (
            <div className="header__avatarFallback">U</div>
          )}
          <FaChevronDown className="dropdown__icon" />
          {showDropdown && (
            <div className="dropdown__menu">
              {user ? (
                <>
                  <div onClick={() => navigate('/profile')}>Profile</div>
                  <div onClick={handleLogout}>Logout</div>
                </>
              ) : (
                <>
                  <div onClick={() => navigate('/login')}>Login</div>
                  <div onClick={() => navigate('/signup')}>Signup</div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
