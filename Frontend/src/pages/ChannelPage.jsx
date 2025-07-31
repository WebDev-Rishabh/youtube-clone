import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import "./styles/ChannelPage.css";

export default function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const BASE_URL = "http://localhost:5000";

  // Fetch channel + its videos
  const fetchChannel = async () => {
    try {
      const { data } = await axiosInstance.get(`/channels/${id}`);
      // API returns { channel, videos }
      setChannel(data.channel);
      setVideos(data.videos);
      if (user) {
        setSubscribed(data.channel.subscribersList?.includes(user._id));
      }
    } catch (err) {
      console.error("Failed to load channel:", err);
      setError("Failed to load channel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const handleSubscribe = async () => {
    try {
      const { data } = await axiosInstance.post(`/channels/${id}/subscribe`);
      setSubscribed(data.subscribed);
      setChannel((prev) => ({ ...prev, subscribersCount: data.count }));
    } catch (err) {
      console.error("Subscribe failed:", err);
    }
  };

  const handleUpload = () => navigate(`/upload?channelId=${channel._id}`);
  const handleEdit   = () => navigate(`/channels/${channel._id}/edit`);
  const handleDelete = async () => {
    if (window.confirm("Delete this channel permanently?")) {
      await axiosInstance.delete(`/channels/${channel._id}`);
      navigate("/channels");
    }
  };

  if (loading) return <div className="cp-center">Loading…</div>;
  if (error)   return <div className="cp-center error">{error}</div>;
  if (!channel) return null;

  const isOwner = user && user.id === channel.owner;
 

  return (
    <div className="cp-container">

      {/* Banner */}
      <div className="cp-banner">
        {channel.channelBanner ? (
          <img
            src={
              channel.channelBanner.startsWith("http")
                ? channel.channelBanner
                : `${BASE_URL}${channel.channelBanner}`
            }
            alt="Channel Banner"
          />
        ) : (
          <div className="cp-banner-fallback" />
        )}
      </div>

      {/* Header: avatar, info, actions */}
      <div className="cp-header">
        <img
          className="cp-avatar"
          src={
            channel.avatar && channel.avatar.startsWith("http")
              ? channel.avatar
              : `${BASE_URL}${channel.avatar || ""}`
          }
          alt="Channel Avatar"
        />
        <div className="cp-info">
          <h2 className="cp-title">{channel.channelName}</h2>
          <p className="cp-subs">
            {channel.subscribersCount?.toLocaleString() || 0} subscribers
          </p>
        </div>
        {isOwner ? (
          <div className="cp-actions">
            <button onClick={handleUpload}>Upload Video</button>
            <button onClick={handleEdit}>Edit</button>
            <button className="dlt-btn" onClick={handleDelete}>Delete</button>
          </div>
        ) : (
          <button
            className={`cp-sub-btn ${subscribed ? "subbed" : ""}`}
            onClick={handleSubscribe}
          >
            {subscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        )}
      </div>

      {/* Videos Grid */}
      <section className="cp-videos">
        <h3>Videos</h3>
        <div className="cp-video-grid">
          {videos.map((vid) => {
            const thumb = vid.thumbnail?.startsWith("http")
              ? vid.thumbnail
              : `${BASE_URL}${vid.thumbnail}`;
            return (
              <Link
                to={`/video/${vid._id}`}
                key={vid._id}
                className="cp-video-card"
              >
                <img src={thumb} alt={vid.title} />
                <div className="cp-video-meta">
                  <p className="cp-video-title">{vid.title}</p>
                  <p className="cp-video-views">
                    {vid.views?.toLocaleString() || 0} views
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
