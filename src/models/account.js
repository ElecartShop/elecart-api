const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true
  },
  users: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
module.exports.Model = mongoose.model('Account', schema);

var ModelTC = new composeWithMongoose(module.exports.Model);

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

ModelTC.addRelation('owner', {
  resolver: () => user.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.owner_id }),
    skip: null,
    sort: null,
  },
  projection: { owner: true },
});

const shop = require('./shop');
ModelTC.addRelation('shops', {
  resolver: () => shop.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ account_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { shops: true },
});

module.exports.ModelTC = ModelTC;
