const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

const schema = new Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  visitor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visitor',
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false
  },
  coupon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    required: false
  },
  notes: {
    type: String
  },
  contact_email: {
    type: String
  },
  contact_phone: {
    type: String
  },
  billing_address: {
    type: String
  },
  billing_address2: {
    type: String
  },
  billing_state_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: false
  },
  billing_county_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'County',
    required: false
  },
  billing_zip: {
    type: String
  },
  processor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Processor',
    required: false
  },
  product_ids: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }],
    required: true
  },
  shipping_address: {
    type: String
  },
  shipping_address2: {
    type: String
  },
  shipping_state_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: false
  },
  shipping_county_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'County',
    required: false
  },
  shipping_zip: {
    type: String
  },
  shipper_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipper',
    required: false
  },
  weight: {
    type: Number
  },
  total: {
    type: Number
  },
  fulfillment: {
    type: String,
    enum: ['Pending', 'Paid', 'Fulfilled']
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
module.exports.Model = mongoose.model('Order', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

ModelTC.queries = [
  {call: 'ById', resolver: 'findById', access: 'customer'},
  {call: 'ByIds', resolver: 'findByIds', access: 'customer'},
  {call: 'One', resolver: 'findOne', access: 'customer'},
  {call: 'Many', resolver: 'findMany', access: 'customer'},
  {call: 'Count', resolver: 'count', access: 'customer'},
  {call: 'Connection', resolver: 'connection', access: 'customer'},
  {call: 'Pagination', resolver: 'pagination', access: 'customer'}
];

ModelTC.mutations = [
  {call: 'CreateOne', resolver: 'createOne', access: 'customer'},
  {call: 'CreateMany', resolver: 'createMany', access: 'user'},
  {call: 'UpdateById', resolver: 'updateById', access: 'customer'},
  {call: 'UpdateOne', resolver: 'updateOne', access: 'customer'},
  {call: 'UpdateMany', resolver: 'updateMany', access: 'user'},
  {call: 'RemoveById', resolver: 'removeById', access: 'user'},
  {call: 'RemoveOne', resolver: 'removeOne', access: 'user'},
  {call: 'RemoveMany', resolver: 'removeMany', access: 'user'}
];

const shop = require('./shop');
ModelTC.addRelation('shop', {
  resolver: () => shop.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.shop_id }),
    skip: null,
    sort: null,
  },
  projection: { shop_id: true }
});

const visitor = require('./visitor');
ModelTC.addRelation('visitor', {
  resolver: () => visitor.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.visitor_id }),
    skip: null,
    sort: null,
  },
  projection: { visitor_id: true }
});

const customer = require('./customer');
ModelTC.addRelation('customer', {
  resolver: () => customer.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.customer_id }),
    skip: null,
    sort: null,
  },
  projection: { customer_id: true }
});

const coupon = require('./coupon');
ModelTC.addRelation('coupon', {
  resolver: () => coupon.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.coupon_id }),
    skip: null,
    sort: null,
  },
  projection: { coupon_id: true }
});

const processor = require('./processor');
ModelTC.addRelation('processor', {
  resolver: () => processor.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.processor_id }),
    skip: null,
    sort: null,
  },
  projection: { processor_id: true }
});

const shipper = require('./shipper');
ModelTC.addRelation('shipper', {
  resolver: () => shipper.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.shipper_id }),
    skip: null,
    sort: null,
  },
  projection: { shipper_id: true }
});

const state = require('./state');
ModelTC.addRelation('billing_state', {
  resolver: () => state.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.billing_state }),
    skip: null,
    sort: null,
  },
  projection: { billing_state: true }
});

ModelTC.addRelation('shipping_state', {
  resolver: () => state.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.shipping_state }),
    skip: null,
    sort: null,
  },
  projection: { shipping_state: true }
});

const county = require('./county');
ModelTC.addRelation('billing_county', {
  resolver: () => county.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.billing_county }),
    skip: null,
    sort: null,
  },
  projection: { billing_county: true }
});

ModelTC.addRelation('shipping_county', {
  resolver: () => county.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.shipping_county }),
    skip: null,
    sort: null,
  },
  projection: { shipping_county: true }
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

module.exports.ModelTC = ModelTC;
