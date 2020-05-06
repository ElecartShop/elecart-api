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
  url: {
    type: String
  },
  sku: {
    type: String
  },
  stock: {
    type: Number,
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

const Model = mongoose.model('Product', schema);
module.exports = {};
module.exports.Model = Model;

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

const productImage = require('./productImage');
ModelTC.addRelation('productImages', {
  resolver: () => productImage.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ product_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { productImages: true }
});

const productAttribute = require('./productAttribute');
ModelTC.addRelation('productAttributes', {
  resolver: () => productAttribute.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ product_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { productAttributes: true }
});

//TODO: Find out how to automatically pass shop_id from shop and category
ModelTC.addResolver({
  name: 'findMany',
  type: [ModelTC],
  args: {shop_id: 'MongoID!'},
  resolve: ({ source, args, context, info }) => {
    return Model.find({ shop_id: args.shop_id });
  }
});

ModelTC.hasFindByURL = true;
ModelTC.addResolver({
  kind: 'query',
  name: 'findByURL',
  args: {
    shop_id: 'MongoID!',
    url: 'String!'
  },
  type: ModelTC.getResolver('findOne').getType(),
  resolve: async ({args, context}) => {
    const product = await Model.findOne({ shop_id: args.shop_id, url: args.url });

    if(!product) {
      throw new Error('Product not found.');
    }

    return product;
  }
});

ModelTC.viewableOnly = true;

module.exports.ModelTC = ModelTC;
