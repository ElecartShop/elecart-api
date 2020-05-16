const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  state_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
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
module.exports.Model = mongoose.model('County', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

ModelTC.queries = [
  {call: 'ById', resolver: 'findById', access: 'anonymous'},
  {call: 'ByIds', resolver: 'findByIds', access: 'anonymous'},
  {call: 'One', resolver: 'findOne', access: 'anonymous'},
  {call: 'Many', resolver: 'findMany', access: 'anonymous'},
  {call: 'Count', resolver: 'count', access: 'anonymous'},
  {call: 'Connection', resolver: 'connection', access: 'anonymous'},
  {call: 'Pagination', resolver: 'pagination', access: 'anonymous'}
];

ModelTC.mutations = [
  {call: 'CreateOne', resolver: 'createOne', access: 'admin'},
  {call: 'CreateMany', resolver: 'createMany', access: 'admin'},
  {call: 'UpdateById', resolver: 'updateById', access: 'admin'},
  {call: 'UpdateOne', resolver: 'updateOne', access: 'admin'},
  {call: 'UpdateMany', resolver: 'updateMany', access: 'admin'},
  {call: 'RemoveById', resolver: 'removeById', access: 'admin'},
  {call: 'RemoveOne', resolver: 'removeOne', access: 'admin'},
  {call: 'RemoveMany', resolver: 'removeMany', access: 'admin'}
];

const state = require('./state');
ModelTC.addRelation('state', {
  resolver: () => state.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.state_id }),
    skip: null,
    sort: null,
  },
  projection: { state_id: true }
});

const countyTax = require('./countyTax');
ModelTC.addRelation('tax', {
  resolver: () => countyTax.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ county_id: source.id }),
    skip: null,
    sort: null,
  },
  projection: { tax: true }
});

module.exports.ModelTC = ModelTC;
