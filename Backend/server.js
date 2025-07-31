import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';import commentRoutes from './routes/commentRoutes.js';

import channelRoutes from './routes/channelRoutes.js';

dotenv.config();

const app = express();
const __dirname = path.resolve();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));
app.use('/uploads/avatars', express.static(path.join(process.cwd(), 'uploads/avatars')));
// Routes
app.use('/api/videos', commentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/channels', channelRoutes);

mongoose.connect(process.env.MONGO_URI)

  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`✅ Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));
