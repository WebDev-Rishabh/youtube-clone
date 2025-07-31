// backend/models/Channel.js
import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelName:   { type: String, required: true, trim: true },
  description:   { type: String, default: '' },
  owner:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avatar:        { type: String, default: '' },    // e.g. '/uploads/12345-avatar.png'
  channelBanner: { type: String, default: '' },    // e.g. '/uploads/12345-banner.png'
  subscribersCount: { type: Number, default: 0 },
  subscribersList:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  videos:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
}, { timestamps: true });

export default mongoose.model('Channel', channelSchema);
