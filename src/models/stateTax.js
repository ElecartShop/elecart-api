const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  state_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'state',
    required: true,
    unqiue: true
  },
  percentage: {
    type: Number
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
module.exports.Model = mongoose.model('StateTax', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

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

ModelTC.viewableOnly = true;

module.exports.ModelTC = ModelTC;
