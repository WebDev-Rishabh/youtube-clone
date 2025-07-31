// backend/controllers/channelController.js
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Channel from '../models/Channel.js';
import Video from '../models/Video.js';
import fs from 'fs';
import path from 'path';

/**
 * @desc    Create a new channel (with optional avatar/banner)
 * @route   POST /api/channels
 * @access  Private
 */
export const createChannel = asyncHandler(async (req, res) => {
  const { channelName, description } = req.body;

  if (!channelName) {
    res.status(400);
    throw new Error('Channel name is required');
  }

  const channel = new Channel({
    channelName,
    description,
    owner: req.user._id,
  });

  if (req.files?.avatar) {
    channel.avatar = `/uploads/${req.files.avatar[0].filename}`;
  }
  if (req.files?.channelBanner) {
    channel.channelBanner = `/uploads/${req.files.channelBanner[0].filename}`;
  }

  await channel.save();
  res.status(201).json(channel);
});


export const getMyChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find({ owner: req.user._id });
  res.status(200).json(channels);
});

/**
 * @desc    Get channel details plus its videos
 * @route   GET /api/channels/:id
 * @access  Public
 */

export const getChannelDetails = asyncHandler(async (req, res) => {
    const channelId = req.params.id;
  
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404);
      throw new Error("Channel not found");
    }
  
    const videos = await Video.find({ channel: channelId })
      .select("title thumbnail views")
      .sort({ createdAt: -1 });
  
    res.status(200).json({ channel, videos });
  });
  

/**
 * @desc    Toggle subscribe/unsubscribe for the authenticated user
 * @route   POST /api/channels/:id/subscribe
 * @access  Private
 */
export const toggleSubscribe = asyncHandler(async (req, res) => {
  const channelId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    res.status(400);
    throw new Error('Invalid channel ID');
  }

  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  const userId = req.user._id.toString();
  const isSubbed = channel.subscribersList.includes(userId);

  if (isSubbed) {
    channel.subscribersList = channel.subscribersList.filter(u => u.toString() !== userId);
    channel.subscribersCount = Math.max(0, channel.subscribersCount - 1);
  } else {
    channel.subscribersList.push(userId);
    channel.subscribersCount += 1;
  }

  await channel.save();
  res.json({ subscribed: !isSubbed, count: channel.subscribersCount });
});

/**
 * @desc    Get channel document only
 * @route   GET /api/channels/:id/basic
 * @access  Public
 */
export const getChannelById = asyncHandler(async (req, res) => {
  const channelId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    res.status(400);
    throw new Error('Invalid channel ID');
  }

  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  res.status(200).json(channel);
});

export const updateChannel = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { channelName, description } = req.body;
  
    const channel = await Channel.findById(id);
    if (!channel) {
      res.status(404);
      throw new Error('Channel not found');
    }
  
    if (channel.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Unauthorized to edit this channel');
    }
  
    channel.channelName = channelName || channel.channelName;
    channel.description = description || channel.description;
  
    if (req.files?.avatar) {
      channel.avatar = `/uploads/${req.files.avatar[0].filename}`;
    }
  
    if (req.files?.channelBanner) {
      channel.channelBanner = `/uploads/${req.files.channelBanner[0].filename}`;
    }
  
    const updated = await channel.save();
    res.json(updated);
  });
  

  // export const deleteChannel = asyncHandler(async (req, res) => {
  //   const channel = await Channel.findById(req.params.id);
  
  //   if (!channel) {
  //     res.status(404);
  //     throw new Error('Channel not found');
  //   }
  
  //   if (channel.owner.toString() !== req.user._id.toString()) {
  //     res.status(403);
  //     throw new Error('Not authorized to delete this channel');
  //   }
  
  //   await channel.deleteOne();
  //   res.json({ message: 'Channel deleted' });
  // });
  export const deleteChannel = asyncHandler(async (req, res) => {
    const channelId = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      res.status(400);
      throw new Error('Invalid channel ID');
    }
  
    const channel = await Channel.findById(channelId);
    if (!channel) {
      res.status(404);
      throw new Error('Channel not found');
    }
  
    // Only the owner may delete
    if (channel.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this channel');
    }
  
    // 1) Find and delete all videos for this channel
    const videos = await Video.find({ channel: channelId });
    for (const vid of videos) {
      // Remove video file
      if (vid.videoUrl) {
        const videoPath = path.join(process.cwd(), vid.videoUrl);
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      }
      // Remove thumbnail
      if (vid.thumbnail) {
        const thumbPath = path.join(process.cwd(), vid.thumbnail);
        if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
      }
      await vid.remove();
    }
  
    // 2) Remove channel’s media files
    if (channel.avatar) {
      const avPath = path.join(process.cwd(), channel.avatar);
      if (fs.existsSync(avPath)) fs.unlinkSync(avPath);
    }
    if (channel.channelBanner) {
      const banPath = path.join(process.cwd(), channel.channelBanner);
      if (fs.existsSync(banPath)) fs.unlinkSync(banPath);
    }
  
    // 3) Finally delete the channel document
    await channel.deleteOne();
  
    res.json({ message: 'Channel and its videos deleted successfully.' });
  });
