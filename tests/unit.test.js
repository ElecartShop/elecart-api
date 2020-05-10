process.env.NODE_ENV = 'testing';
const mongoose = require('../src/config/mongoose');
let db;

before(function(done) {
  db = mongoose(function() {
    done();
  });
});

describe('Unit Tests', () => {
  delete require.cache[require.resolve('./unit/county')];
  require('./unit/county');

  delete require.cache[require.resolve('./unit/countyTax')];
  require('./unit/countyTax');

  delete require.cache[require.resolve('./unit/state')];
  require('./unit/state');

  delete require.cache[require.resolve('./unit/stateTax')];
  require('./unit/stateTax');

  delete require.cache[require.resolve('./unit/processor')];
  require('./unit/processor');

  delete require.cache[require.resolve('./unit/shipper')];
  require('./unit/shipper');

  delete require.cache[require.resolve('./unit/user')];
  require('./unit/user');
});

after(function(done) {
  db.disconnect().then(function() {
    done();
  });
});
