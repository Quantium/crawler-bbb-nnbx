'use strict';

var Crawler = require('../crawler');

var crawler = new Crawler({
  url: 'www.nonabox.es',
  initialUrl: '/tienda',
  parser: 'nonabox',
  pattern: /tienda\/articulo\/.+/
});

crawler.start({
  maxDepth: 10,
  maxConcurrency: 10
});
