const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
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
});

module.exports = {};
module.exports.Model = mongoose.model('User', schema);

var ModelTC = new composeWithMongoose(module.exports.Model);

const account = require('./account');
ModelTC.addRelation('account', {
  resolver: () => account.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ id: source.account_id }),
    skip: null,
    sort: null,
  },
  projection: { account_id: true },
});

module.exports.ModelTC = ModelTC;
