const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// render data
router.get('/', postController.homePage);
router.post('/add-post', postController.addPost);
router.get('/delete-post/:id', postController.deletePost);
router.post('/add-comment/:postId', postController.addComment);

module.exports = router;
