var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: true
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

var Model = mongoose.model('User', userSchema);
module.exports = Model;
