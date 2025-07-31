// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import videoReducer from './videoSlice'; // optional if using videos

const store = configureStore({
  reducer: {
    auth: authReducer,
    video: videoReducer, // only if you're using video slice
  },
});

export default store;
