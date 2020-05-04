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
  product_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    required: true
  },
  image_url: {
    type: String
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

const shop = require('./shop');
ModelTC.addRelation('shop', {
  resolver: () => shop.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.shop_id }),
    skip: null,
    sort: null,
  },
  projection: { shop_id: true },
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
