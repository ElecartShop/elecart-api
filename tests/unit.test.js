process.env.NODE_ENV = 'testing';
const mongoose = require('../src/config/mongoose');
let db;

before(function(done) {
  db = mongoose(function() {
    done();
  });
});

describe('Unit Tests', () => {
  var roles = ['admin', 'user', 'customer', 'anonymous'];
  var models = [
    'account', 'admin', 'attribute', 'attributeValue', 'call', 'card', 'cart',
    'category', 'categoryTag', 'county', 'countyTax', 'coupon', 'customer',
    'group', 'order', 'processor', 'product', 'productImage', 'productTag',
    'refund', 'shipper', 'shop', 'shopProcessor', 'shopShipper', 'state',
    'stateTax', 'user', 'visitor'
  ];

  roles.forEach((role) => {
    describe('As '+role.charAt(0).toUpperCase()+role.slice(1), () => {
      models.forEach((model) => {
        const path = './unit/'+role+'/'+model;
        delete require.cache[require.resolve(path)];
        require(path);
      });
    });
  });
});

after(function(done) {
  db.disconnect().then(function() {
    done();
  });
});
