const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  group_ids: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Group',
    required: true
  },
  user_ids: {
    type: [mongoose.Schema.Types.ObjectId],
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
const Model = mongoose.model('Shop', schema);
module.exports.Model = Model;

const ModelTC = new composeWithMongoose(Model);

ModelTC.queries = [
  {call: 'ById', resolver: 'findById', access: 'anonymous'},
  {call: 'ByIds', resolver: 'findByIds', access: 'user'},
  {call: 'One', resolver: 'findOne', access: 'anonymous'},
  {call: 'Many', resolver: 'findMany', access: 'user'},
  {call: 'Count', resolver: 'count', access: 'user'},
  {call: 'Connection', resolver: 'connection', access: 'user'},
  {call: 'Pagination', resolver: 'pagination', access: 'user'}
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

const account = require('./account');
ModelTC.addRelation('account', {
  resolver: () => account.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.account_id }),
    skip: null,
    sort: null,
  },
  projection: { account_id: true }
});

const user = require('./user');
ModelTC.addRelation('users', {
  resolver: () => user.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({
      _operators : {
        _id: { in: source.user_ids }
      }
    }),
    skip: null,
    sort: null,
  },
  projection: { users: true },
});

const group = require('./group');
ModelTC.addRelation('groups', {
  resolver: () => group.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({
      _operators : {
        _id: { in: source.group_ids }
      }
    }),
    skip: null,
    sort: null,
  },
  projection: { groups: true }
});

const category = require('./category');
ModelTC.addRelation('categories', {
  resolver: () => category.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ shop_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { categories: true }
});

const product = require('./product');
ModelTC.addRelation('products', {
  resolver: () => product.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ shop_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { products: true }
});

ModelTC.addResolver({
  name: 'findMany',
  type: [ModelTC],
  args: {account_id: 'MongoID!'},
  resolve: async ({ source, args, context, info }) => await Model.find({ account_id: args.account_id })
});

module.exports.ModelTC = ModelTC;
