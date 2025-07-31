// backend/models/Video.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Video description is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail path is required'],
    },
    videoUrl: {
      type: String,
      required: [true, 'Video file path is required'],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [] 
    }],
    dislikes: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      default: [] 
    }],
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model('Video', videoSchema);

export default Video;
