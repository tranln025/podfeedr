const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  reviewer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [{
    type: String,
    default: 'No reviews yet',
  }]
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;