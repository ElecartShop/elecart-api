var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true
  },
  shop_id: {
    type: String,
    required: true
  },
  parent: {
    type: String,
    required: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Date,
    required: false
  }
});

var Model = mongoose.model('Category', schema);
module.exports = Model;
