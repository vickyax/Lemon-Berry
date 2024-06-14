const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  id: {type: String ,required: true},
  username: { type: String, required: true },
  message: { type: String, required: true }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
