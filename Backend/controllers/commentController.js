import Comment from '../models/commentModel.js';

export const addComment = async (req, res) => {
  const { text } = req.body;
  const { videoId } = req.params;

  try {
    const comment = await Comment.create({
      video: videoId,
      user: req.user._id,
      text,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

export const getVideoComments = async (req, res) => {
  const { videoId } = req.params;

  try {
    const comments = await Comment.find({ video: videoId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};
