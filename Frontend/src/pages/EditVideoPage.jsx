import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "./styles/EditVideoPage.css";

const EditVideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    thumbnail: null,
    videoUrl: null,
  });

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const { data } = await axiosInstance.get(`/videos/${id}`);
        setVideoData({
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        console.error("Failed to fetch video:", error);
      }
    };
    fetchVideo();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVideoData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setVideoData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", videoData.title);
    formData.append("description", videoData.description);
    if (videoData.thumbnail) formData.append("thumbnail", videoData.thumbnail);
    if (videoData.videoUrl) formData.append("videoUrl", videoData.videoUrl);

    try {
      await axiosInstance.put(`/videos/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video updated successfully!");
      navigate(`/videos/${id}`);
    } catch (err) {
      console.error("Error updating video:", err);
      alert("Failed to update video.");
    }
  };

  return (
    <div className="edit-video-container">
      <h2>Edit Video</h2>
      <form className="edit-video-form" onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={videoData.title}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={videoData.description}
          onChange={handleChange}
          required
        />

        <label>Change Thumbnail:</label>
        <input type="file" name="thumbnail" onChange={handleFileChange} accept="image/*" />

        <label>Change Video File:</label>
        <input type="file" name="videoUrl" onChange={handleFileChange} accept="video/*" />

        <div className="form-actions">
          <button type="submit">Update Video</button>
        </div>
      </form>
    </div>
  );
};

export default EditVideoPage;
