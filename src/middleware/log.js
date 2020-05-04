const Call = require('../models/call').Model;

module.exports = (req, res, next) => {
  if (req.body.variables.shop_id) {
    var call = Call.create({shop_id: req.body.variables.shop_id});
  }

  next();
}
