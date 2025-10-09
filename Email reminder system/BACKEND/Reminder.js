const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  title: String,
  message: String,
  email: String,
  dateTime: Date,
  sent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reminder', reminderSchema);
