import React, { useEffect, useState } from 'react';
import axiosInstance from "../utils/axiosInstance";
import { Link } from 'react-router-dom';
import './styles/MyChannels.css';

const MyChannels = () => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await axiosInstance.get("/channels/me");
        setChannels(res.data);
      } catch (err) {
        console.error("Failed to load channels:", err);
      }
    };

    fetchChannels();
  }, []);

  return (
    <div className="my-channels-container">
      <h2>My Channels</h2>
      <div className="channels-list">
        {channels.map((channel) => (
          <Link
            to={`/channels/${channel._id}`}
            key={channel._id}
            className="channel-card-link"
          >
            <div className="channel-card">
              <img
                src={`http://localhost:5000${channel.avatar}`}
                alt="Avatar"
                className="channel-avatar"
              />
              <div className="channel-info">
                <h3>{channel.channelName}</h3>
                <p>{channel.description}</p>
                <span className="edit-inline-note">Click to view or edit</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyChannels;
