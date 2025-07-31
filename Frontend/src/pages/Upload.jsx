// src/pages/Upload.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import './styles/Upload.css';

export default function Upload() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [form, setForm] = useState({
    channelId: '',
    title: '',
    description: '',
    thumbnail: null,
    video: null,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { data } = await axiosInstance.get('/channels/me');
        setChannels(data);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };
    fetchChannels();
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.channelId) {
      setMessage('Please select a channel.');
      return;
    }
    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => fd.append(key, val));

    try {
      await axiosInstance.post('/videos/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Upload successful! Redirecting…');
      setTimeout(() => (window.location = '/'), 1500);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed.');
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label>
          Channel
          <select
            name="channelId"
            value={form.channelId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Channel --</option>
            {channels.map(ch => (
              <option key={ch._id} value={ch._id}>{ch.channelName}</option>
            ))}
          </select>
        </label>

        <label>
          Title
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
          />
        </label>

        <label>
          Thumbnail
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Video File
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={!form.channelId}>Upload</button>
      </form>

      {message && <p className="upload-message">{message}</p>}
    </div>
  );
}
