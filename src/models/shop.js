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
  users: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  groups: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true
    }
  }],
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
module.exports.Model = mongoose.model('Shop', schema);

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

const user = require('./user');
ModelTC.addRelation('users', {
  resolver: () => user.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ account_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { users: true },
});

const group = require('./group');
ModelTC.addRelation('groups', {
  resolver: () => group.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ shop_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { groups: true },
});

module.exports.ModelTC = ModelTC;
