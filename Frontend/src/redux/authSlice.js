// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('auth')) || {};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: saved.user || null,       // { _id, username, ... }
    token: saved.token || null      // your JWT
  },
  reducers: {
    loginSuccess: (state, action) => {
      // payload = { user: {...}, token: 'JWT…' }
      state.user  = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('auth', JSON.stringify({
        user:  action.payload.user,
        token: action.payload.token
      }));
    },
    logout: (state) => {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('auth');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
