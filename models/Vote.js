const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  os: {
    type: Object,
    required: true
  },
  points: {
    type: Object,
    required: true
  }
});

// Create collection and add schema
const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;