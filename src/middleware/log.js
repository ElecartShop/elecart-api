const Call = require('../models/call').Model;

// TODO: This doesn't actually track unless they send it through the variables
module.exports = (req, res, next) => {
  if (req.body.variables && req.body.variables.shop_id) {
    var call = Call.create({shop_id: req.body.variables.shop_id});
  }

  next();
}
