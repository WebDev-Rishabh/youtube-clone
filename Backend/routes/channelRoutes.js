import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createChannel,
  getMyChannels,
  getChannelDetails,
  toggleSubscribe,
  getChannelById,
  updateChannel,
  deleteChannel 
} from '../controllers/channelController.js';
import { uploadChannelMedia } from '../middleware/uploadMiddleware.js';
import Channel from '../models/Channel.js';
const router = express.Router();

// This must come before `/:id`
router.get('/me', protect, getMyChannels); 

// Create a new channel with  avatar/banner
router.post(
  '/',
  protect,
  uploadChannelMedia.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'channelBanner', maxCount: 1 }
  ]),
  createChannel
);
router.get('/', protect, async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id });
    res.json(channels);
  } catch (err) {
    console.error('Failed to get channels:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.put(
  '/:id/edit',
  protect,
  uploadChannelMedia.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'channelBanner', maxCount: 1 }
  ]),
  updateChannel
);
router.get("/:id", getChannelDetails);

// Subscribe/unsubscribe
router.post('/:id/subscribe', protect, toggleSubscribe);

// Get channel details including videos
router.get("/channels/:id", protect, getChannelById);

// basic channel fetch (just for UI or channel selector)
router.get('/:id/basic', getChannelById);
router.delete('/:id', protect, deleteChannel);

export default router;
