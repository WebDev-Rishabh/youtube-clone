// src/pages/ChannelEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import './styles/ChannelForm.css';

export default function ChannelEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BACKEND_URL = 'http://localhost:5000';

  const [formData, setFormData] = useState({
    channelName: '',
    description: '',
    avatar: null,
    channelBanner: null,
  });
  const [preview, setPreview] = useState({
    avatar: '',
    channelBanner: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        // This endpoint returns the raw Channel document
        const data = await axiosInstance
          .get(`/channels/${id}/basic`)
          .then(res => res.data);

        setFormData(fd => ({
          ...fd,
          channelName: data.channelName,
          description: data.description,
        }));
        setPreview({
          avatar: data.avatar ? BACKEND_URL + data.avatar : '',
          channelBanner: data.channelBanner
            ? BACKEND_URL + data.channelBanner
            : '',
        });
      } catch (err) {
        console.error('Failed to fetch channel:', err);
        
      }
    };
    fetchChannel();
  }, [id]);

  const handleChange = e => {
    const { name, files, value } = e.target;
    if (files) {
      const file = files[0];
      setFormData(fd => ({ ...fd, [name]: file }));
      setPreview(pv => ({ ...pv, [name]: URL.createObjectURL(file) }));
    } else {
      setFormData(fd => ({ ...fd, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    fd.append('channelName', formData.channelName);
    fd.append('description', formData.description);
    if (formData.avatar) fd.append('avatar', formData.avatar);
    if (formData.channelBanner) fd.append('channelBanner', formData.channelBanner);

    try {
      await axiosInstance.put(`/channels/${id}/edit`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/channels/${id}`);
    } catch (err) {
      console.error('Update failed:', err);
      setError('Update failed. Please try again.');
    }
  };

  return (
    <div className="edit-channel-container">
      <h2>Edit Channel</h2>
      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="edit-channel-form">
        <label>
          Channel Name
          <input
            type="text"
            name="channelName"
            value={formData.channelName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label>
          Avatar
          {preview.avatar && (
            <img
              src={preview.avatar}
              alt="Avatar preview"
              className="preview-img avatar"
            />
          )}
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <label>
          Channel Banner
          {preview.channelBanner && (
            <img
              src={preview.channelBanner}
              alt="Banner preview"
              className="preview-img banner"
            />
          )}
          <input
            type="file"
            name="channelBanner"
            accept="image/*"
            onChange={handleChange}
          />
        </label>

        <div className="form-buttons">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
