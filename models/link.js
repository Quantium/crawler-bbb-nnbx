'use strict';

var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  url: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  depth: Number,
  status: Number,
  last_modified: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Link', schema);
