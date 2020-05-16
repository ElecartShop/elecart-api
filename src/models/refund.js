const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

const schema = new Schema({
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
  {call: 'CreateOne', resolver: 'createOne', access: 'user'},
  {call: 'CreateMany', resolver: 'createMany', access: 'user'},
  {call: 'UpdateById', resolver: 'updateById', access: 'user'},
  {call: 'UpdateOne', resolver: 'updateOne', access: 'user'},
  {call: 'UpdateMany', resolver: 'updateMany', access: 'user'},
  {call: 'RemoveById', resolver: 'removeById', access: 'admin'},
  {call: 'RemoveOne', resolver: 'removeOne', access: 'admin'},
  {call: 'RemoveMany', resolver: 'removeMany', access: 'admin'}
];

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

module.exports.ModelTC = ModelTC;
