import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; 
import "./styles/ChannelPage.css"; 


const ChannelPage = () => {
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const BASE_URL = "http://localhost:5000";

  const fetchChannelData = async () => {
    try {
      // ✅ Correct endpoint as per your new backend route
      const res = await axiosInstance.get(`/channels/${channelId}`);
      setChannel(res.data.channel);
      setVideos(res.data.videos);
    } catch (err) {
      console.error("Failed to fetch channel:", err);
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [channelId]);

  if (!channel) return <div>Loading...</div>;

  return (
    <div className="channel-page">
      <div className="channel-banner">
        {channel.channelBanner && (
          <img src={`${BASE_URL}${channel.banner}`}
           alt="Banner" />
        )}
      </div>

      <div className="channel-info">
        <img
          src={`http://localhost:5000${channel.avatar || "/default-avatar.png"}`}
          alt="Avatar"
          className="channel-avatar"
        />
        <div>
          <h2>{channel.channelName}</h2>
          <p>{channel.description}</p>
          <p>{channel.subscribersCount || 0} subscribers</p>
        </div>
      </div>

      <div className="video-section">
        <h3>Videos</h3>
        <div className="video-grid">
          {videos.map((video) => (
            <div key={video._id} className="video-card">
              <img src={`http://localhost:5000${video.thumbnail}`} alt={video.title} />
              <p>{video.title}</p>
              <p>{video.views} views</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
