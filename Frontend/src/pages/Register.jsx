import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Register.css';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    avatar: null,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      setForm(f => ({ ...f, avatar: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('username', form.username);
      fd.append('email', form.email);
      fd.append('password', form.password);
      if (form.avatar) fd.append('avatar', form.avatar);

      const { data } = await axiosInstance.post('/auth/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // save token & redirect
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Avatar (optional)</label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleChange}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}
