var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true
  },
  account_id: {
    type: String,
    required: true
  },
  users: [{
    id: {
      type: String,
      required: true
    }
  }],
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

var Model = mongoose.model('Group', schema);
module.exports = Model;
