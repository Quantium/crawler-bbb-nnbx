'use strict';

var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  sku: String,
  title: {
    type: String,
    required: true
  },
  categories: Array,
  description: String,
  price: String,
  images: Array,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', schema);
