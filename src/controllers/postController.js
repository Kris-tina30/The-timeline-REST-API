const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('comments', '_id userComment');

    const formattedPosts = posts.map((post) => ({
      ...post._doc,
      createdAt: new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(post.createdAt),
    }));

    res.json({ success: true, data: formattedPosts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

const addPost = async (req, res) => {
  try {
    const { userName, userMessage } = req.body;
    if (!userName || !userMessage) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    const newPost = new Post({ userName, userMessage });
    await newPost.save();
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res
        .status(404)
        .json({ success: false, message: 'Post not found' });
    }

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userComment } = req.body;

    if (!userComment) {
      return res
        .status(400)
        .json({ success: false, message: 'Comment cannot be empty' });
    }

    const newComment = new Comment({ userComment, post: postId });
    const savedComment = await newComment.save();

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id },
    });

    res.status(201).json({ success: true, data: savedComment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};

const notFoundPage = (req, res) => {};

module.exports = {
  getPosts,
  addPost,
  deletePost,
  addComment,
  notFoundPage,
};
