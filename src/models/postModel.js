const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: [5, 'Your name must by more than 5 characters!'],
    },

    userMessage: {
      type: String,
      required: true,
      minlength: [25, 'Your Message must by more than 25 characters!'],
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }],
  },
  { timestamps: true },
);
module.exports = mongoose.model('post', postSchema);
