//TODO: Shipper Model

const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
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
module.exports.Model = mongoose.model('Shipper', schema);

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

module.exports.ModelTC = ModelTC;
