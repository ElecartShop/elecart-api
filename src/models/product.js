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
  url: {
    type: String
  },
  summery: {
    type: String
  },
  weight: {
    type: Number
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

schema.index({shop_id: 1, url: 1}, {unique: true});
schema.index({shop_id: 1, name: 1}, {unique: true});

module.exports = {};
module.exports.Model = mongoose.model('Product', schema);

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

const productImage = require('./productImage');
ModelTC.addRelation('productImages', {
  resolver: () => productImage.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ product_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { productImages: true },
});

const productAttribute = require('./productAttribute');
ModelTC.addRelation('productAttributes', {
  resolver: () => productAttribute.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ product_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { productAttributes: true },
});

module.exports.ModelTC = ModelTC;
