// src/pages/VideoPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector }       from 'react-redux';
import axiosInstance         from '../utils/axiosInstance';
import './styles/VideoPage.css';
import {
  FaThumbsUp,
  FaThumbsDown,
  FaShare,
  FaBell,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from 'react-icons/fa';

export default function VideoPage() {
  const { id } = useParams();
  const user    = useSelector(state => state.auth.user);
  const myId    = String(user?._id || user?.id || '');



  const [video,      setVideo]      = useState(null);
  
  const [comments,   setComments]   = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId,  setEditingId]  = useState(null);
  const [editText,   setEditText]   = useState('');
  const [otherVideos, setOtherVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [channel, setChannel]     = useState(null);
  // action flags
  const [likeLoading,    setLikeLoading]    = useState(false);
  const [dislikeLoading, setDislikeLoading] = useState(false);
  const [subLoading,     setSubLoading]     = useState(false);

  const BASE = 'http://localhost:5000';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // 1) Fetch video (includes isLiked/isDisliked/isSubscribed, counts)
        const { data: v } = await axiosInstance.get(`/videos/${id}`);
        if (cancelled) return;
        setVideo(v);
        const { data: channelData } = await axiosInstance.get(`/channels/${v.channel._id}`);
        if (cancelled) return;
        setChannel(channelData.channel);
        setOtherVideos(channelData.videos);
        // 2) Fetch comments (populated with user)
        const { data: comm } = await axiosInstance.get(`/videos/${id}/comments`);
        if (cancelled) return;
        setComments(comm);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="vp-center">Loading…</div>;
  if (error)   return <div className="vp-center error">{error}</div>;
  if (!video)  return <div className="vp-center">Video not found</div>;

  // Destructure with safe defaults
  const {
    title,
    videoUrl,
    thumbnail,
    createdAt,
    views            = 0,
    likes            = 0,
    dislikes         = 0,
    subscribersCount = 0,
    isLiked  = false,
    isDisliked = false,
    isSubscribed = false,
    
    
    description,
  } = video;
  const isOwner = video?.channel?.owner?._id === myId;

  console.log(video.channel.owner);
  console.log('user id',myId);

  // asset URLs
  const poster = thumbnail.startsWith('http')
    ? thumbnail
    : `${BASE}${thumbnail}`;
  const src = videoUrl.startsWith('http')
    ? videoUrl
    : `${BASE}${videoUrl}`;

  // Like/Dislike/Subscribe handlers
  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const { data } = await axiosInstance.post(`/videos/${id}/like`);
      setVideo(v => ({
        ...v,
        likes:      data.likes,
        isLiked:    true,
        dislikes:   v.isDisliked ? v.dislikes - 1 : v.dislikes,
        isDisliked: false,
      }));
    } finally { setLikeLoading(false); }
  };

  const handleDislike = async () => {
    if (dislikeLoading) return;
    setDislikeLoading(true);
    try {
      const { data } = await axiosInstance.post(`/videos/${id}/dislike`);
      setVideo(v => ({
        ...v,
        dislikes:   data.dislikes,
        isDisliked: true,
        likes:      v.isLiked ? v.likes - 1 : v.likes,
        isLiked:    false,
      }));
    } finally { setDislikeLoading(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied');
  };

  const handleSubscribe = async () => {
    if (subLoading) return;
    setSubLoading(true);
    try {
      const { data } = await axiosInstance.post(`/channels/${channel._id}/subscribe`);
      setVideo(v => ({
        ...v,
        isSubscribed:    data.subscribed,
        subscribersCount: data.count,
      }));
    } catch {
      alert('Subscribe failed');
    } finally {
      setSubLoading(false);
    }
  };

  // Comments: add / edit / delete
  const postComment = async e => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const { data } = await axiosInstance.post(`/videos/${id}/comments`, { text: newComment });
      setComments(cs => [data, ...cs]);
      setNewComment('');
    } catch {
      console.error('Comment failed');
    }
  };

  const startEditing = cmt => {
    setEditingId(cmt._id);
    setEditText(cmt.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async cmtId => {
    try {
      const { data } = await axiosInstance.put(`/videos/${id}/comments/${cmtId}`, { text: editText });
      setComments(cs => cs.map(c => c._id === cmtId ? data : c));
      cancelEdit();
    } catch {
      console.error('Edit failed');
    }
  };

  const deleteComment = async cmtId => {
    if (!window.confirm('Delete comment?')) return;
    try {
      await axiosInstance.delete(`/videos/${id}/comments/${cmtId}`);
      setComments(cs => cs.filter(c => c._id !== cmtId));
    } catch {
      console.error('Delete failed');
    }
  };

  return (
    <div className="vp-container">
      {/* Player */}
      <div className="vp-player-section">
        <video
          className="vp-player"
          controls
          poster={poster}
          src={src}
        />
        <div className="vp-title-row">
        <h1 className="vp-title">{title}</h1>
        {isOwner && (
  <div className="vp-owner-controls">
    <Link to={`/videos/${id}/edit`} className="vp-edit-btn">
      <FaEdit /> Edit Video
    </Link>
    <button
      className="vp-delete-btn"
      onClick={async () => {
        if (window.confirm('Are you sure you want to delete this video?')) {
          try {
            await axiosInstance.delete(`/videos/${id}`);
            alert('Video deleted successfully');
            window.location.href = '/';
          } catch (err) {
            alert('Failed to delete video');
          }
        }
      }}
    >
      <FaTrash /> Delete Video
    </button>
  </div>
)}
</div>

        <div className="vp-metadata">
          <span>
            {views.toLocaleString()} views • {new Date(createdAt).toLocaleDateString()}
          </span>
          <div className="vp-actions">
            <button onClick={handleLike}    disabled={likeLoading}    className={isLiked    ? 'active' : ''}>
              <FaThumbsUp /> {likes.toLocaleString()}
            </button>
            <button onClick={handleDislike} disabled={dislikeLoading} className={isDisliked ? 'active' : ''}>
              <FaThumbsDown /> {dislikes.toLocaleString()}
            </button>
            <button onClick={handleShare}>
              <FaShare /> Share
            </button>
            <button onClick={handleSubscribe} disabled={subLoading} className={isSubscribed ? 'subbed' : ''}>
              <FaBell /> {isSubscribed
                ? `Subscribed • ${subscribersCount.toLocaleString()}`
                : `Subscribe • ${subscribersCount.toLocaleString()}`}
            </button>
          </div>
        </div>

        <p className="vp-description">{description}</p>

        {/* Comments */}
        <div className="vp-comments-section">
          <h3>{comments.length} Comments</h3>
          <form onSubmit={postComment} className="vp-comment-form">
            <input
              type="text"
              placeholder="Add a public comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
            />
            <button type="submit">Comment</button>
          </form>

          <div className="vp-comments-list">
            {comments.map(cmt => {
              const cmtUserId = String(cmt.user?._id || '');
              const mine      = cmtUserId === myId;

              return (
                <div key={cmt._id} className="vp-comment">
                  <div className="vp-comment-avatar">
                    {cmt.user.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="vp-comment-body">
                    <p className="vp-comment-user">{cmt.user.username}</p>

                    {editingId === cmt._id ? (
                      <textarea
                        className="vp-edit-input"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                      />
                    ) : (
                      <p className="vp-comment-text">{cmt.text}</p>
                    )}
                  </div>

                  {mine && (
                    <div className="vp-comment-actions">
                      {editingId === cmt._id ? (
                        <>
                          <button onClick={() => saveEdit(cmt._id)}><FaSave/></button>
                          <button onClick={cancelEdit}><FaTimes/></button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEditing(cmt)}><FaEdit/></button>
                          <button onClick={() => deleteComment(cmt._id)}><FaTrash/></button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar: channel + more videos */}
      <aside className="vp-channel-section">
        <div className="vp-channel-card">
        <div className="vp-avatar">
  <img src={channel.avatar?.startsWith('http') ? channel.avatar : `${BASE}${channel.avatar}`} alt="Avatar" />
</div>
          <div className="vp-channel-info">
            <Link to={`/channels/${channel._id}`} className="vp-channel-link">
              {channel.channelName}
            </Link>
            <p>{channel.description}</p>
            <p>{subscribersCount.toLocaleString()} subscribers</p>
          </div>
        </div>

        <div className="vp-other-videos">
              <h4>More from this channel</h4>
              {otherVideos.map(vid => {
                const thumb = vid.thumbnail.startsWith('http')
                  ? vid.thumbnail
                  : `http://localhost:5000${vid.thumbnail}`;
                return (
                  <Link key={vid._id} to={`/video/${vid._id}`} className="vp-other-video-card">
                    <img src={thumb} alt={vid.title} />
                    <div className="vp-other-video-info">
                      <p className="vp-other-title">{vid.title}</p>
                      <p className="vp-other-meta">{vid.views} views</p>
                    </div>
                  </Link>
                );
              })}
            </div>
      </aside>
    </div>
  );
}
