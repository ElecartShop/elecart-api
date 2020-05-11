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
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategoryTag',
    required: true
  }],
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

schema.index({shop_id: 1});
schema.index({shop_id: 1, url: 1}, {unique: true});
schema.index({shop_id: 1, name: 1}, {unique: true});
schema.index({shop_id: 1, parent_id: 1});

const Model = mongoose.model('Category', schema);
module.exports = {};
module.exports.Model = Model;

const ModelTC = new composeWithMongoose(Model);

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

const category = require('./category');
if (shop.ModelTC) { // So we don't go in to a loop
  ModelTC.addRelation('parent', {
    resolver: () => category.ModelTC.getResolver('findOne'),
    prepareArgs: {
      filter: (source) => ({ _id: source.parent_id }),
      skip: null,
      sort: null,
    },
    projection: { parent: true }
  });
}

//TODO: Find out how to automatically pass shop_id from category
ModelTC.addRelation('children', {
  resolver: () => ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ parent_id: source._id }),
    skip: null,
    sort: null,
  },
  projection: { children: true }
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
  projection: { products: true }
});

//TODO: Find out how to automatically pass shop_id from shop
ModelTC.addResolver({
  name: 'findMany',
  type: [ModelTC],
  args: {shop_id: 'MongoID!', parent_id: 'MongoID'},
  resolve: async ({ source, args, context, info }) => {
    const findArgs = { shop_id: args.shop_id };

    if (args.parent_id) {
      findArgs.parent_id = args.parent_id;
    } else if (args.filter && args.filter.parent_id) {
      findArgs.parent_id = args.filter.parent_id;
    } else {
      findArgs.parent_id = null;
    }

    const results = await Model.find(findArgs);
    return results;
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
    const category = await Model.findOne({ shop_id: args.shop_id, url: args.url });

    if(!category) {
      throw new Error('Category not found.');
    }

    return category;
  }
});

module.exports.ModelTC = ModelTC;
