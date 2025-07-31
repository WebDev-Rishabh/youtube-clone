// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // or use Vite proxy: baseURL: '/api'
});

// Add JWT token from localStorage/session
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or sessionStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
