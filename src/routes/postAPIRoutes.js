const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/posts', postController.getPosts);
router.post('/posts', postController.createPost);
router.delete('/posts/:id', postController.deletePost);
router.post('/posts/:postId/comments', postController.addComment);

module.exports = router;
