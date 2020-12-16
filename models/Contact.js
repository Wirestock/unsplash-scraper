const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  _id: {type: mongoose.Schema.ObjectId, default: new mongoose.Types.ObjectId()},
  email: {type: String},
  instagram: {type: String},
  twitter: {type: String},
  website: {type: String},
  username: {type: String}
});

module.exports = mongoose.model('contact', ContactSchema);
