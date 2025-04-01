const Post = require('../models/postModel');
const Comment = require('../models/commentModel');

const getFormattedPosts = () => {
  return Post.find()
    .sort({ createdAt: -1 })
    .populate('comments', '_id userComment')
    .then((result) => {
      return result.map((post) => ({
        // Додано return перед result.map
        ...post._doc,
        // comments: post.comments,
        createdAt: new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(post.createdAt),
      }));
    });
};

const homePage = (req, res) => {
  getFormattedPosts()
    .then((formattedData) => {
      res.render('index', { data: formattedData || [], errors: '' });
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error');
    });
};

const addPost = (req, res) => {
  const addNewPost = new Post(req.body);

  addNewPost
    .save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return getFormattedPosts().then((formattedData) => {
          res.render('index', { data: formattedData, errors: err.errors });
        });
      }
      res.status(500).send('Internal Server Error');
    });
};

const deletePost = (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

const addComment = (req, res) => {
  let postId = req.params.postId;
  if (req.body.userComment !== '' && postId) {
    let commentData = {
      ...req.body,
      post: postId,
    };
    const addNewComment = new Comment(commentData);

    addNewComment
      .save()
      .then((savedComment) => {
        Post.findById(postId)
          .then((postInfo) => {
            console.log(postInfo);
            postInfo.comments.push(savedComment._id);
            postInfo
              .save()
              .then(() => {
                res.redirect('/');
              })
              .catch((err) => {
                console.log(err);
              });
          })

          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const notFoundPage = (req, res) => {};

module.exports = {
  getFormattedPosts,
  homePage,
  addPost,
  deletePost,
  addComment,
  notFoundPage,
};
