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
  attribute_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attribute',
    required: true
  },
  show: {
    type: Boolean,
    required: true,
    default: true
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

schema.index({shop_id: 1, attribute_id: 1, name: 1}, {unique: true});

module.exports = {};
module.exports.Model = mongoose.model('AttributeValues', schema);

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
if (shop.ModelTC) { // So we don't go in to a loop
  ModelTC.addRelation('shop', {
    resolver: () => shop.ModelTC.getResolver('findOne'),
    prepareArgs: {
      filter: (source) => ({ _id: source.shop_id }),
      skip: null,
      sort: null,
    },
    projection: { shop_id: true }
  });
}

const attribute = require('./attribute');
if (attribute.ModelTC) { // So we don't go in to a loop
  ModelTC.addRelation('attribute', {
    resolver: () => attribute.ModelTC.getResolver('findOne'),
    prepareArgs: {
      filter: (source) => ({ _id: source.attribute_id }),
      skip: null,
      sort: null,
    },
    projection: { attribute_id: true }
  });
}

module.exports.ModelTC = ModelTC;
