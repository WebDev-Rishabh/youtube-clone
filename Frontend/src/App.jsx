// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import VideoPage from './pages/VideoPage';
import ChannelPage from './pages/ChannelPage';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import MyChannels from './pages/MyChannels';
import CreateChannel from './pages/CreateChannel';
import ChannelEditPage from './pages/ChannelEditPage';
import EditVideoPage from './pages/EditVideoPage';


function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes under Layout */}
      <Route element={<Layout />}>
        {/* This is the “homepage” now */}
        <Route
          index
          element={
            
              <Home />
           
          }
        />

        <Route
          path="video/:id"
          element={
            <PrivateRoute>
              <VideoPage />
            </PrivateRoute>
          }
        />

        <Route
          path="channel/:id"
          element={
            <PrivateRoute>
              <ChannelPage />
            </PrivateRoute>
          }
        />

        <Route
          path="upload"
          element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          }
        />
        <Route
  path="channels"
  element={
    <PrivateRoute>
      <MyChannels />
    </PrivateRoute>
  }
/>
<Route path="create-channel" element={<PrivateRoute><CreateChannel/></PrivateRoute>} />
<Route path="/channels/:id" element={<ChannelPage />} />
<Route path="/channels/:id/edit" element={<ChannelEditPage />} /> 
<Route path="/videos/:id/edit" element={<EditVideoPage />} />

      </Route>
    </Routes>
  );
}
