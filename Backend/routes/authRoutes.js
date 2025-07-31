import express from 'express';
import { register, login } from '../controllers/authController.js';
import { uploadAvatar } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post(
    '/register',
    uploadAvatar.single('avatar'),
    register
  );
router.post('/login', login);

export default router;
