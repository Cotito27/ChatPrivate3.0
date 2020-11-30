const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  name: String,
  user: String,
  destino: String,
  message: String
});

module.exports = mongoose.model('Message', MessageSchema);