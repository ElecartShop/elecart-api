const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

var schema = new Schema({
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
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  value: {
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
}, {
  collection: 'productAttributes'
});

schema.index({attribute_id: 1, product_id: 1}, {unique: true});

module.exports = {};
module.exports.Model = mongoose.model('ProductAttributes', schema);

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

const attribute = require('./attribute');
ModelTC.addRelation('attribute', {
  resolver: () => attribute.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.attribute_id }),
    skip: null,
    sort: null,
  },
  projection: { attribute_id: true },
});

const product = require('./product');
ModelTC.addRelation('product', {
  resolver: () => product.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.product_id }),
    skip: null,
    sort: null,
  },
  projection: { product_id: true },
});


ModelTC.viewableOnly = true;

module.exports.ModelTC = ModelTC;
