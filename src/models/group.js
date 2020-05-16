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

schema.index({account_id: 1, name: 1}, {unique: true});

module.exports = {};
module.exports.Model = mongoose.model('Group', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

ModelTC.queries = [
  {call: 'ById', resolver: 'findById', access: 'user'},
  {call: 'ByIds', resolver: 'findByIds', access: 'user'},
  {call: 'One', resolver: 'findOne', access: 'user'},
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
    filter: (source) => ({ account_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { users: true }
});

/*const shop = require('./shop');
ModelTC.addRelation('shops', {
  resolver: () => shop.ModelTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source) => ({ account_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { shops: true }
});*/

module.exports.ModelTC = ModelTC;
