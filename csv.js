'use strict';

var fs = require('fs');
var Product = require('./models/product');

require('colors');

var data = 'SKU¶Category¶Subcategory¶Display Name¶Description¶Unit Price¶Product Image\n';

Product.find({}, function (err, products) {
  if (err) { return console.log(err); }

  products.forEach(function (product) {
    var line = '', category, subcategory;

    if (product.categories && product.categories.length) {
      category = product.categories.slice(product.categories.length - 1);
      subcategory = product.categories.slice(product.categories.length - 2);
    }

    line += product.sku + '¶';
    line += (category || '') + '¶';
    line += (subcategory || '') + '¶';
    line += product.title + '¶';
    line += product.description + '¶';
    line += product.price + '¶';
    line += product.images[0] + '\n';

    data += line;
  });

  fs.writeFile('./products.csv', data, function (err) {
    if (err) { return console.log(err); }

    console.log(('The file was generated correctly').yellow);
    process.exit();
  });
});
