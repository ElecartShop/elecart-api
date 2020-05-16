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
  metaDescription: {
    type: String
  },
  metaKeywords: [{
    name: {
      type: String,
      required: true
    }
  }],
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductTag',
    required: true
  }],
  sku: {
    type: String
  },
  stock: {
    type: Number,
  },
  price: {
    type: Number,
    required: true
  },
  summery: {
    type: String
  },
  attributes: [{
    attribute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attribute',
    },
    attribute_value_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AttributeValue',
    }
  }],
  variants: [{
    name: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String
    },
    price: {
      type: Number,
      required: true
    }
  }],
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

// TODO: Add attributes relation

// TODO: Find out how to automatically pass shop_id from shop and category
ModelTC.addResolver({
  name: 'findMany',
  type: [ModelTC],
  args: {shop_id: 'MongoID!'},
  resolve: ({ source, args, context, info }) => Model.find({ shop_id: args.shop_id })
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

module.exports.ModelTC = ModelTC;
