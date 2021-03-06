'use strict';

var Product = require('./models/product');
var xray = require('x-ray');
var x = xray();

require('colors');

var clearProduct = function (product) {
  product = product || {};

  for (var prop in product) {
    if (product.hasOwnProperty(prop)) {
      // Format strings
      if (typeof product[prop] === 'string') {
        product[prop] = product[prop].trim();
      }

      // Format arrays
      if (product[prop] instanceof Array) {
        product[prop] = product[prop].map(function (item) {
          item = item.trim();
          item = item.replace(/(\r\n|\n|\r)/gm, '');

          return item;
        }).filter(String);
      }
    }
  }

  return product;
};

module.exports.nonabox = function (html) {
  if (!html) { return; }

  x(html, '.single-product-view', {
    title: 'h1.h1',
    description: '.product-shop-description #tab1',
    price: '.price-product-shop span',
    images: ['.product-image img@src'],
    sku: '.do-things-box .rating input[name=product-id]@value'
  })(function (err, product) {
    if (err) { return console.log(err.toString().red); }
    if (!product) { return; }

    product = clearProduct(product);

    // Create product
    Product.findOneAsync({ sku: product.sku })
      .then(function (_product) {
        if (_product) {
          for (var prop in product) {
            if (product.hasOwnProperty(prop)) {
              _product[prop] = product[prop];
            }
          }

          _product.updated_at = Date.now();

          return _product.save();
        }

        return Product.create(product);
      })
      .then(function (product) {
        if (product) {
          console.log('Product has been stored'.cyan, (product._id).toString().yellow);
        }
      })
      .catch(function (e) { console.log('Error'.red, e); });
  });
};


// Parse BuyBuyBaby products
module.exports.bbb = function (html) {
  if (!html) { return; }

  // Parsing
  x(html, '#content', {
    title: 'h1#productTitle',
    description: '.productDetails .productDesc .noprint',
    categories: ['.breadcrumbs a'],
    price: '.productDetails .prodPrice',
    images: ['a#mainProductImgZoom@data-zoomhref'],
    sku: '.productDetails p.prodSKU'
  })(function (err, product) {
    if (err) { return console.log(err.toString().red); }
    if (!product) { return; }

    product = clearProduct(product);

    // Set properties
    product.price = parseFloat(product.price.replace('$', ''));
    product.categories = product.categories.slice(1);
    product.images = product.images.map(function (i) { return 'http:' + i; });
    product.sku = parseInt(product.sku.replace('SKU # ', ''), 10);

    // Create product
    Product.findOneAsync({ sku: product.sku })
      .then(function (_product) {
        if (_product) {
          for (var prop in product) {
            if (product.hasOwnProperty(prop)) {
              _product[prop] = product[prop];
            }
          }

          _product.updated_at = Date.now();

          return _product.save();
        }

        return Product.create(product);
      })
      .then(function (product) {
        if (product) {
          console.log('Product has been stored'.cyan, (product._id).toString().yellow);
        }
      })
      .catch(function (e) { console.log('Error'.red, e); });
  });
};
