const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

//TODO: Maybe add type
const schema = new Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = {};
module.exports.Model = mongoose.model('Call', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

ModelTC.queries = [
  {call: 'ById', resolver: 'findById', access: 'admin'},
  {call: 'ByIds', resolver: 'findByIds', access: 'admin'},
  {call: 'One', resolver: 'findOne', access: 'admin'},
  {call: 'Many', resolver: 'findMany', access: 'admin'},
  {call: 'Count', resolver: 'count', access: 'user'},
  {call: 'Connection', resolver: 'connection', access: 'admin'},
  {call: 'Pagination', resolver: 'pagination', access: 'admin'}
];

ModelTC.mutations = [
  {call: 'CreateOne', resolver: 'createOne', access: 'admin'},
  {call: 'CreateMany', resolver: 'createMany', access: 'admin'},
  {call: 'UpdateById', resolver: 'updateById', access: 'admin'},
  {call: 'UpdateOne', resolver: 'updateOne', access: 'admin'},
  {call: 'UpdateMany', resolver: 'updateMany', access: 'admin'},
  {call: 'RemoveById', resolver: 'removeById', access: 'admin'},
  {call: 'RemoveOne', resolver: 'removeOne', access: 'admin'},
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

module.exports.ModelTC = ModelTC;
