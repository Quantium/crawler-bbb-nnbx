'use strict';

var conf = require('../conf');
var mongoose = require('mongoose');
var P = require('bluebird');

// Promisify
P.promisifyAll(mongoose);

// Connect to mongo
mongoose.connect(conf.mongo.url);

// Events
mongoose.connection.on('error', console.error);
mongoose.connection.once('open', function () {
  console.info('Mongo connected to ' + conf.mongo.url);
});

module.exports = mongoose;
