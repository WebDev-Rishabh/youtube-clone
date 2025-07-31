import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  addComment,
  getVideoComments,
} from '../controllers/commentController.js';

const router = express.Router();

// Add a comment to a video
router.post('/:videoId/comments', protect, addComment);

// Get all comments for a video
router.get('/:videoId/comments', getVideoComments);

export default router;

