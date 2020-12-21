const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, default: new mongoose.Types.ObjectId()},
  username: {type: String, unique: true},
  bio: {type: String, maxlength: 99999},
  portfolio_url: {type: String, maxlength: 999},
  first_name: {type: String},
  last_name: {type: String},
  location: {type: String},
  twitter_username: {type: String},
  instagram_username: {type: String},
  email: {type: String}
});

module.exports = mongoose.model('user', UserSchema);
