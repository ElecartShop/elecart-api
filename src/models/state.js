const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  shortcode: {
    type: String,
    required: true,
    unique: true
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

module.exports = {};
module.exports.Model = mongoose.model('State', schema);

var ModelTC = new composeWithMongoose(module.exports.Model);

const stateTax = require('./stateTax');
ModelTC.addRelation('tax', {
  resolver: () => stateTax.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ state_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { tax: true }
});

ModelTC.viewableOnly = true;

module.exports.ModelTC = ModelTC;
