import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./styles/CreateChannel.css";
import { useNavigate } from "react-router-dom";

const CreateChannel = () => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("channelName", channelName);
    formData.append("description", description);
    if (avatar) formData.append("avatar", avatar);
    if (banner) formData.append("channelBanner", banner); 
    try {
      await axiosInstance.post("/channels", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/channels");
    } catch (error) {
      console.error("Error creating channel:", error.response?.data || error.message);
      alert("Failed to create channel. Check console for error.");
    }
  };

  return (
    <div className="create-channel-modal">
      <form onSubmit={handleSubmit} className="create-channel-form">
        <h1>Create your own channel</h1>
        <h2>How you'll appear</h2>

        <div className="image-inputs">
          <label>
            Select Avatar:
            <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
          </label>
          <label>
            Select Banner:
            <input type="file" accept="image/*" onChange={(e) => setBanner(e.target.files[0])} />
          </label>
        </div>

        <input
          type="text"
          placeholder="Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Channel Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <div className="actions">
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit">Create Channel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateChannel;
