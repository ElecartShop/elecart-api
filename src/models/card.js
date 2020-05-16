const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
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

module.exports = {};
module.exports.Model = mongoose.model('Card', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

ModelTC.queries = [
  {call: 'ById', resolver: 'findById', access: 'customer'},
  {call: 'ByIds', resolver: 'findByIds', access: 'customer'},
  {call: 'One', resolver: 'findOne', access: 'customer'},
  {call: 'Many', resolver: 'findMany', access: 'customer'},
  {call: 'Count', resolver: 'count', access: 'customer'},
  {call: 'Connection', resolver: 'connection', access: 'customer'},
  {call: 'Pagination', resolver: 'pagination', access: 'customer'}
];

ModelTC.mutations = [
  {call: 'CreateOne', resolver: 'createOne', access: 'customer'},
  {call: 'CreateMany', resolver: 'createMany', access: 'admin'},
  {call: 'UpdateById', resolver: 'updateById', access: 'customer'},
  {call: 'UpdateOne', resolver: 'updateOne', access: 'customer'},
  {call: 'UpdateMany', resolver: 'updateMany', access: 'admin'},
  {call: 'RemoveById', resolver: 'removeById', access: 'customer'},
  {call: 'RemoveOne', resolver: 'removeOne', access: 'customer'},
  {call: 'RemoveMany', resolver: 'removeMany', access: 'admin'}
];

const shop = require('./shop');
ModelTC.addRelation('shop', {
  resolver: () => shop.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.shop_id }),
    skip: null,
    sort: null,
  },
  projection: { shop_id: true }
});

const visitor = require('./visitor');
ModelTC.addRelation('visitor', {
  resolver: () => visitor.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.visitor_id }),
    skip: null,
    sort: null,
  },
  projection: { visitor_id: true }
});

const customer = require('./customer');
ModelTC.addRelation('customer', {
  resolver: () => customer.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.customer_id }),
    skip: null,
    sort: null,
  },
  projection: { customer_id: true }
});

module.exports.ModelTC = ModelTC;
