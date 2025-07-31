// backend/controllers/videoController.js
import asyncHandler from 'express-async-handler';
import Video from '../models/Video.js';
import Comment from '../models/commentModel.js';
import Channel from '../models/Channel.js';
import fs from 'fs';

//
// 1️⃣ Upload a new video
//
export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, channelId } = req.body;
  const files = req.files || {};

  // Ensure both files are present
  if (!files.thumbnail?.[0] || !files.video?.[0]) {
    res.status(400);
    throw new Error('Thumbnail and video files are required');
  }

  // Verify channel
  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  // Create the Video document
  const video = await Video.create({
    user:        req.user._id,
    title,
    description,
    thumbnail:   `/uploads/${files.thumbnail[0].filename}`,
    videoUrl:    `/uploads/${files.video[0].filename}`,
    channel:     channel._id,
    views:       0,
    likes:       [],
    dislikes:    []
  });

  // Push into channel.videos array
  channel.videos.push(video._id);
  await channel.save();

  res.status(201).json(video);
});

//
// 2️⃣ Fetch all videos (for home page grid)
//
export const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find()
  .sort({ createdAt: -1 })
    .populate('channel', 'channelName');
  res.status(200).json(videos);
});

//
// 3️⃣ Fetch single video by ID, increment views, return counts & flags
//
export const getVideoById = asyncHandler(async (req, res) => {
  const vid = await Video.findById(req.params.id)
    .populate('user', 'username avatar')
    .populate({
      path: 'channel',
      select: 'channelName description subscribersCount subscribersList videos owner',
      populate: {
        path: 'owner',       // 👈 populate owner inside channel
        select: 'username avatar', // 👈 get only what’s needed
      }
    });

  if (!vid) {
    res.status(404);
    throw new Error('Video not found');
  }

  // Increment view count
  vid.views += 1;
  await vid.save();

  const userId = req.user?._id.toString();
  const isLiked = vid.likes.includes(userId);
  const isDisliked = vid.dislikes.includes(userId);
  const isSubscribed = vid.channel.subscribersList.includes(userId);

  // Return clean JSON object
  res.status(200).json({
    _id:            vid._id,
    title:          vid.title,
    description:    vid.description,
    thumbnail:      vid.thumbnail,
    videoUrl:       vid.videoUrl,
    views:          vid.views,
    likes:          vid.likes.length,
    dislikes:       vid.dislikes.length,
    createdAt:      vid.createdAt,
    user:           vid.user,
    channel: {
      _id:              vid.channel._id,
      channelName:      vid.channel.channelName,
      description:      vid.channel.description,
      subscribersCount: vid.channel.subscribersList.length,
      subscribersList:  vid.channel.subscribersList,
      videos:           vid.channel.videos,
      owner: {
        _id:      vid.channel.owner?._id,
        username: vid.channel.owner?.username,
        avatar:   vid.channel.owner?.avatar
      }
    },
    isLiked,
    isDisliked,
    isSubscribed
  });
});


//
// 4️⃣ Like a video
//
export const likeVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  const userId = req.user._id.toString();
  // Initialize arrays if missing
  video.likes    = video.likes    || [];
  video.dislikes = video.dislikes || [];

  if (!video.likes.includes(userId)) {
    video.likes.push(userId);
    // Remove from dislikes if present
    video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
  }

  await video.save();
  res.status(200).json({ likes: video.likes.length });
});

//
// 5️⃣ Dislike a video
//
export const dislikeVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }

  const userId = req.user._id.toString();
  video.likes    = video.likes    || [];
  video.dislikes = video.dislikes || [];

  if (!video.dislikes.includes(userId)) {
    video.dislikes.push(userId);
    // Remove from likes if present
    video.likes = video.likes.filter(id => id.toString() !== userId);
  }

  await video.save();
  res.status(200).json({ dislikes: video.dislikes.length });
});

//
// 6️⃣ Add a comment
//
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Comment text required');
  }

  const comment = await Comment.create({
    video: req.params.id,
    user:  req.user._id,
    text
  });

  // Populate user on return
  await comment.populate('user', 'username avatar');
  res.status(201).json(comment);
});

//
// 7️⃣ Fetch comments for a video
//
export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ video: req.params.id })
    .populate('user', '_id username avatar')
    .sort({ createdAt: -1 });
  res.status(200).json(comments);
});



// Edit a comment
export const editComment = asyncHandler(async (req, res) => {
  const { id: videoId, commentId } = req.params;
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error('Text is required');
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not your comment');
  }

  comment.text = text;
  await comment.save();
  // populate user
  await comment.populate('user', 'username');
  res.json(comment);
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { id: videoId, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }
  if (comment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not your comment');
  }
  await comment.deleteOne();
  res.json({ success: true, commentId });
});


export const getVideosByChannel = async (req, res) => {
    try {
      const videos = await Video.find({ channel: req.params.channelId });
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos", error });
    }
  };
  export const updateVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);
    if (!video) {
      res.status(404);
      throw new Error("Video not found");
    }
  
    // Optional: only allow owner to update
    if (video.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to edit this video");
    }
  
    // Handle file updates
    if (req.files?.thumbnail) {
      video.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    }
    if (req.files?.videoUrl) {
      video.videoUrl = `/uploads/${req.files.videoUrl[0].filename}`;
    }
  
    // Handle text updates
    video.title = req.body.title || video.title;
    video.description = req.body.description || video.description;
  
    await video.save();
    res.status(200).json({ message: "Video updated successfully", video });
  });
  export const deleteVideo = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);
  
    if (!video) {
      res.status(404);
      throw new Error("Video not found");
    }
  
    // Check if the logged-in user is the owner of the video
    if (video.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this video");
    }
  
    // Optional: Remove video and thumbnail files from the server
    if (video.thumbnail) {
      fs.unlink(`.${video.thumbnail}`, (err) => {
        if (err) console.error("Failed to delete thumbnail:", err);
      });
    }
    if (video.videoUrl) {
      fs.unlink(`.${video.videoUrl}`, (err) => {
        if (err) console.error("Failed to delete video file:", err);
      });
    }
  
    // Delete video document from DB
    await video.deleteOne();
  
    res.status(200).json({ message: "Video deleted successfully" });
  });