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
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  url: {
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
  collection: 'productImages'
});

module.exports = {};
module.exports.Model = mongoose.model('ProductImage', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

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

const product = require('./product');
if (product.ModelTC) {
  ModelTC.addRelation('product', {
    resolver: () => product.ModelTC.getResolver('findOne'),
    prepareArgs: {
      filter: (source) => ({ _id: source.product_id }),
      skip: null,
      sort: null,
    },
    projection: { product_id: true }
  });
}


ModelTC.viewableOnly = true;

module.exports.ModelTC = ModelTC;
