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
module.exports.Model = mongoose.model('CountyTax', schema);

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

ModelTC.viewableOnly = true;

module.exports.ModelTC = ModelTC;
