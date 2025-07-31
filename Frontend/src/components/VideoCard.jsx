// src/components/VideoCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/VideoCard.css'; 

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const thumbUrl = `http://localhost:5000${video.thumbnail}`;
  return (
    <div onClick={() => navigate(`/video/${video._id}`)} style={styles.card}>
      <img src={thumbUrl} alt={video.title} style={styles.thumb} />
      <h4 style={styles.title}>{video.title}</h4>
      <p style={styles.meta}>{video.channelName}</p>
      <p style={styles.meta}>{video.views.toLocaleString()} views</p>
    </div>
  );
}

const styles = {
  card: {
    cursor: 'pointer',
    background: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  thumb: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
  },
  title: {
    fontSize: '16px',
    margin: '8px',
  },
  meta: {
    fontSize: '14px',
    color: '#555',
    margin: '0 8px 8px',
  },
};
