import React, { useState } from 'react';
import axios from 'axios';

import './styles/UploadVideoForm.css';

const UploadVideoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('thumbnail', thumbnail);
    formData.append('video', video);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload success:', res.data);
      alert('Video uploaded!');
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-form-container">
    <form onSubmit={handleSubmit}>
      <h3>Upload a New Video</h3>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files[0])} required />
      <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} required />
      <button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Video'}</button>
    </form>
  </div>
  );
};

export default UploadVideoForm;
