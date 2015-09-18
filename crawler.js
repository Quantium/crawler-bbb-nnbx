'use strict';

var Crawler = require('simplecrawler');
var debug = require('debug')('crawler');
var Link = require('./models/link');
var parsers = require('./parsers');
var url = require('url');

require('colors');

var C = function (options) {
  options = options || {};

  var self = this;

  this.url = options.url;
  this.initialUrl = options.initialUrl || '/';
  this.initialProtocol = options.initialProtocol || 'http';
  this.parser = parsers[options.parser];
  this.pattern = options.pattern || /./;

  if (!this.url) {
    return new Error('Add URL to crawler');
  }

  if (!this.parser) {
    return new Error('Add a valid parser');
  }

  this.crawler = new Crawler(options.url, options.initialUrl);
  this.crawler.initialProtocol = this.initialProtocol;

  this.crawler.on('crawlstart', function () {
    debug('Start crawling...');
  });

  this.crawler.on('fetchcomplete', function(item, buffer, response) {
    if (!/text\/html/.test(response.headers['content-type'])) { return; }

    var item_url = url.parse(item.url);
    item_url = item_url.protocol + '//' + item_url.host + '/' + item_url.pathname;

    var parser = self.parser;
    var pattern = self.pattern;

    // Search link
    Link.findOneAsync({ url: item_url })
      .then(function (link) {
        if (link) {
          link.depth = item.depth;
          link.status = item.stateData.code;
          link.last_modified = item.stateData.headers['last-modified'];

          // Update link
          return link.save();
        }

        // Create link
        return Link.createAsync({
          url: item.url,
          depth: item.depth,
          status: item.stateData.code,
          last_modified: item.stateData.headers['last-modified']
        });
      })
      .then(function (link) {
        if (link) {
          if (pattern.test(item.url)) {
            parser(buffer.toString());
          }

          return console.log('Link synced'.green, link.url.white);
        }
      })
      .catch(function (e) { console.log('Error'.red, e); });
  });
};

C.prototype.start = function (options) {
  options = options || {};

  this.crawler.maxDepth = options.maxDepth || 3;
  this.crawler.timeout = options.timeout || 10000;
  this.crawler.maxConcurrency = options.maxConcurrency || 1;

  this.crawler.start();
};

module.exports = C;
