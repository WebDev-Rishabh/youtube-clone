// src/utils/axiosInstance.js
import axios from 'axios';
import store from '../redux/store';  // wherever your store lives

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

axiosInstance.interceptors.request.use(config => {
  const { token } = store.getState().auth;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
