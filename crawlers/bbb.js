'use strict';

var Crawler = require('../crawler');

var crawler = new Crawler({
  url: 'www.buybuybaby.com',
  parser: 'bbb',
  pattern: /store\/product\/.+/
});

crawler.start();
