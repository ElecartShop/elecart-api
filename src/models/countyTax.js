const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  county_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'County',
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
module.exports.Model = mongoose.model('CountyTaxes', schema);

var ModelTC = new composeWithMongoose(module.exports.Model);

const county = require('./county');
ModelTC.addRelation('county', {
  resolver: () => county.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.county_id }),
    skip: null,
    sort: null,
  },
  projection: { county_id: true }
});

ModelTC.viewableOnly = true;

module.exports.ModelTC = ModelTC;
