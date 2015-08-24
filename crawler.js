'use strict';

var Crawler = require('simplecrawler');
var Link = require('./models/link');
var parseProduct = require('./parse');
var url = require('url');

require('colors');

var crawler = new Crawler('www.buybuybaby.com', '/');
crawler.on('fetchcomplete', function(item, buffer) {
  var item_url = url.parse(item.url);
  item_url = item_url.protocol + '//' + item_url.host + '/' + item_url.pathname;

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
        // Parse product
        if (/store\/product\/.+\/\d+$/.test(item.url)) {
          parseProduct(buffer.toString());
        }

        return console.log('Link synced'.green, link.url.white);
      }
    })
    .catch(function (e) { console.log('Error'.red, e); });
});

crawler.maxDepth = 3;
crawler.timeout = 100000;
crawler.maxConcurrency = 1000;
crawler.start();
