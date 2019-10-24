const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  podcasts: [{
    type: Schema.Types.ObjectId,
    ref: 'Podcast',
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;