const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
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
module.exports.Model = mongoose.model('Category', schema);

var ModelTC = new composeWithMongoose(module.exports.Model);

const customer = require('./customer');
ModelTC.addRelation('customer', {
  resolver: () => customer.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.customer_id }),
    skip: null,
    sort: null,
  },
  projection: { customer_id: true },
});

const category = require('./category');
ModelTC.addRelation('parent', {
  resolver: () => category.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.parent_id }),
    skip: null,
    sort: null,
  },
  projection: { parent: true },
});

module.exports.ModelTC = ModelTC;
