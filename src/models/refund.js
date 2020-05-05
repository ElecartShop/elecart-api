const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

var schema = new Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  reason: {
    type: String
  },
  value: {
    type: Number,
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

module.exports = {};
module.exports.Model = mongoose.model('Refund', schema);

var ModelTC = new composeWithMongoose(module.exports.Model);

const order = require('./order');
ModelTC.addRelation('order', {
  resolver: () => order.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.order_id }),
    skip: null,
    sort: null,
  },
  projection: { order_id: true }
});

ModelTC.needsAuthorized = true;

module.exports.ModelTC = ModelTC;
