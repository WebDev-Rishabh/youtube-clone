const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const cm = require('../controllers/commentController');
router.post('/', auth, cm.addComment);
router.get('/:videoId', cm.getComments);
router.put('/:id', auth, cm.updateComment);
router.delete('/:id', auth, cm.deleteComment);
module.exports = router;