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
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  url: {
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
}, {
  collection: 'productImages'
});

module.exports = {};
module.exports.Model = mongoose.model('ProductImage', schema);

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

module.exports.ModelTC = ModelTC;
