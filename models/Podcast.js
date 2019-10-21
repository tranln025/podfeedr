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
  itunesLink: String,
  imageSource: String,
  reviews: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
  }
});

const Podcast = mongoose.model('Podcast', podcastSchema);

module.exports = Podcast;