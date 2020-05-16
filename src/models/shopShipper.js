const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

const schema = new Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
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
module.exports.Model = mongoose.model('ShopShipper', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

ModelTC.queries = [
  {call: 'ById', resolver: 'findById', access: 'anonymous'},
  {call: 'ByIds', resolver: 'findByIds', access: 'anonymous'},
  {call: 'One', resolver: 'findOne', access: 'anonymous'},
  {call: 'Many', resolver: 'findMany', access: 'anonymous'},
  {call: 'Count', resolver: 'count', access: 'anonymous'},
  {call: 'Connection', resolver: 'connection', access: 'anonymous'},
  {call: 'Pagination', resolver: 'pagination', access: 'anonymous'}
];

ModelTC.mutations = [
  {call: 'CreateOne', resolver: 'createOne', access: 'user'},
  {call: 'CreateMany', resolver: 'createMany', access: 'user'},
  {call: 'UpdateById', resolver: 'updateById', access: 'user'},
  {call: 'UpdateOne', resolver: 'updateOne', access: 'user'},
  {call: 'UpdateMany', resolver: 'updateMany', access: 'user'},
  {call: 'RemoveById', resolver: 'removeById', access: 'user'},
  {call: 'RemoveOne', resolver: 'removeOne', access: 'user'},
  {call: 'RemoveMany', resolver: 'removeMany', access: 'user'}
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

module.exports.ModelTC = ModelTC;
