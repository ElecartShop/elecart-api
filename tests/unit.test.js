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
