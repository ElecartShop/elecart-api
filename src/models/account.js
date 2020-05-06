const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  user_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true
  },
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
const Model = mongoose.model('Account', schema);
module.exports.Model = Model;

const ModelTC = new composeWithMongoose(Model);

const user = require('./user');
ModelTC.addRelation('users', {
  resolver: () => user.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ account_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { users: true }
});

ModelTC.addRelation('owner', {
  resolver: () => user.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.owner_id }),
    skip: null,
    sort: null,
  },
  projection: { owner: true }
});

const shop = require('./shop');
ModelTC.addRelation('shops', {
  resolver: () => shop.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ account_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { shops: true }
});

ModelTC.addResolver({
  name: 'findById',
  type: ModelTC,
  args: {_id: 'MongoID!'},
  resolve: ({ source, args, context, info }) => Model.findOne({ _id: args._id, user_ids: context.req.user_id })
});

ModelTC.addResolver({
  name: 'findByIds',
  type: [ModelTC],
  args: {_ids: ['MongoID!']},
  resolve: ({ source, args, context, info }) => Model.find({ _id: {$in: args._ids}, user_ids: context.req.user_id })
});

ModelTC.addResolver({
  name: 'findOne',
  type: ModelTC,
  args: { filter: 'FilterAccountInput' },
  resolve: ({ source, args, context, info }) => {
    if (!args.filter) {
      args.filter = {};
    }
    args.filter.user_ids = context.req.user_id;

    return Model.findOne(args.filter);
  }
});

ModelTC.addResolver({
  name: 'find',
  type: [ModelTC],
  args: { filter: 'FilterAccountInput' },
  resolve: ({ source, args, context, info }) => {
    if (!args.filter) {
      args.filter = {};
    }
    args.filter.user_ids = context.req.user_id;

    return Model.find(args.filter);
  }
});

ModelTC.addResolver({
  name: 'findMany',
  type: [ModelTC],
  resolve: ({ source, args, context, info }) => Model.find({ user_ids: context.req.user_id })
});

ModelTC.addResolver({
  name: 'count',
  type: 'Int',
  args: { filter: 'FilterAccountInput' },
  resolve: ({ source, args, context, info }) => {
    if (!args.filter) {
      args.filter = {};
    }
    args.filter.user_ids = context.req.user_id;

    return Model.countDocuments(args.filter);
  }
});

ModelTC.needsAuthorized = true;

module.exports.ModelTC = ModelTC;
