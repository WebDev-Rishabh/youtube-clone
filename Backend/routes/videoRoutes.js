// backend/routes/videos.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import Video from '../models/Video.js';
import { uploadVideo as uploadVideoMiddleware } from '../middleware/uploadMiddleware.js';
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  likeVideo,
  dislikeVideo,
  addComment,
  getComments,
  editComment,
   deleteComment,
   updateVideo,
   deleteVideo,

} from '../controllers/videoController.js';

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});
const upload = multer({ storage });

/*----------------------------------
  ✅ Upload Video with thumbnail
----------------------------------*/
router.post(
  '/upload',
  protect,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, description, channelId } = req.body;

      if (!title || !description || !channelId) {
        return res.status(400).json({ message: 'Title, description and channelId are required.' });
      }
      if (!req.files?.thumbnail || !req.files?.video) {
        return res.status(400).json({ message: 'Both thumbnail and video files must be uploaded.' });
      }

      const thumbnailFile = req.files.thumbnail[0].filename;
      const videoFile = req.files.video[0].filename;

      const newVideo = new Video({
        title,
        description,
        channel: channelId,
        thumbnail: `/uploads/${thumbnailFile}`,
        videoUrl: `/uploads/${videoFile}`,
        user: req.user._id
      });

      await newVideo.save();
      res.status(201).json({ message: 'Video uploaded successfully.', video: newVideo });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ message: 'Server error during upload', error: err.message });
    }
  }
);

/*----------------------------------
  ✅ Get all videos
----------------------------------*/
router.get('/', getAllVideos); 


/*----------------------------------
  ✅ Get video by ID & increment views
----------------------------------*/
router.get('/:id', protect, getVideoById);

/*----------------------------------
  ✅ Like / Dislike
----------------------------------*/
router.post('/:id/like', protect, likeVideo);
router.post('/:id/dislike', protect, dislikeVideo);

/*----------------------------------
  ✅ Comments
----------------------------------*/
router.post('/:id/comments', protect, addComment);
router.get('/:id/comments', getComments);
router.put('/:id/comments/:commentId', protect, editComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

router.put('/:id', protect, upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "videoUrl", maxCount: 1 }
]), updateVideo)
router.delete('/:id', protect, deleteVideo);

export default router;
