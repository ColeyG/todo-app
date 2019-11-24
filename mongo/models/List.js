const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: String,
  dueDate: Date,
  done: Boolean,
});

module.exports = mongoose.model('List', listSchema);
