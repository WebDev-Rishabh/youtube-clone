// src/pages/Login.jsx
import React, { useState } from 'react';
import { useDispatch }       from 'react-redux';
import { loginSuccess }      from '../redux/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance         from '../utils/axiosInstance';
import './styles/Login.css';  // add your own styling here

export default function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const dispatch = useDispatch();
  const nav      = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    try {
      // axiosInstance already points to http://localhost:5000/api
      const res = await axiosInstance.post('/auth/login', { email, password });
      const { user, token } = res.data;  
      
      // dispatch into Redux + localStorage
      dispatch(loginSuccess({ user, token }));

      // navigate home
      nav('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Login</button>

        <p className="switch">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
