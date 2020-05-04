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
  url: {
    type: String
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

schema.index({shop_id: 1, url: 1}, {unique: true});

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

const product = require('./product');
ModelTC.addRelation('products', {
  resolver: () => product.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({
      _operators : {
        _id: { in: source.product_ids }
      }
    }),
    skip: null,
    sort: null,
  },
  projection: { products: true },
});

module.exports.ModelTC = ModelTC;
