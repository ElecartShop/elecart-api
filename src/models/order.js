const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

var schema = new Schema({
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
  processor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Processor',
    required: false
  },
  products: {
    type: [{}],
    required: true
  },
  shipper_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipper',
    required: false
  },
  total: {

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

var ModelTC = new composeWithMongoose(module.exports.Model);

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

module.exports.ModelTC = ModelTC;
