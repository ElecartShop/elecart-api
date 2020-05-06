const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

//TODO: Maybe add type
const schema = new Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = {};
module.exports.Model = mongoose.model('Call', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

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

ModelTC.needsAuthorized = true;

module.exports.ModelTC = ModelTC;
