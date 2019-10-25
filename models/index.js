const mongoose = require('mongoose');
require('dotenv').config();

const DB_URI = process.env.MONGODB_URI;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));


module.exports = {
  User: require('./User'),
  Podcast: require('./Podcast'),
};
