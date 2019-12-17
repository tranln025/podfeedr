const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const podcastSchema = new Schema({
  name: {
    type: String,
    default: 'No name found',
    unique: true,
  },
  artist: {
    type: String,
    default: 'No artist found',
  },
  itunesLink: {
    type: String,
    unique: true,
  },
  imageSource: String,
  heartCount: {
    type: Number,
    default: 0,
  }
});

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;