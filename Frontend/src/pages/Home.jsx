// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    axios.get('/api/videos')
      .then(({ data }) => {
        setVideos(data);
        setFilteredVideos(data); // show all videos initially
      })
      .catch(console.error);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(value)
    );
    setFilteredVideos(filtered);
  };

  return (
    <div style={{ padding: '16px' }}>
      <input
        type="text"
        placeholder="Search videos..."
        value={searchText}
        onChange={handleSearch}
        style={{
          padding: '10px',
          width: '100%',
          maxWidth: '400px',
          marginBottom: '20px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          alignItems:'center',
          justifyContent:'center',
        }}
      />
      
      <div style={styles.grid}>
        {filteredVideos.length > 0 ? (
          filteredVideos.map(v => (
            <VideoCard
              key={v._id}
              video={{
                _id: v._id,
                title: `Title: ${v.title}`,
                thumbnail: v.thumbnail,
                channelName: `Uploaded By: ${v.channel?.channelName || 'Unknown'}`,
                views: v.views || 0,
              }}
            />
          ))
        ) : (
          <p>No videos match your search.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  },
};
