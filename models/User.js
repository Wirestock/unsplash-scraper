const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, default: new mongoose.Types.ObjectId()},
  username: {type: String, unique: true},
});

module.exports = mongoose.model('user', UserSchema);
