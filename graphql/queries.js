const fs = require('fs');
const path = require('path');

const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLList = require('graphql').GraphQLList;

const basename = path.basename(__filename);
var queries = {};

function singular(object, type, model) {
  return {
    type: type,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve(root, params) {
      const data = model.findById(params.id).exec();
      if (!data) {
        throw new Error('Error');
      }
      return data;
    }
  };
}

function many(object, type, model) {
  return {
    type: new GraphQLList(type),
    resolve() {
      const data = model.find({deleted: null}).exec();
      if (!data) {
        throw new Error('Error');
      }
      return data;
    }
  };
}

fs
  .readdirSync(__dirname+'/types')
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const object = file.slice(0, -3);
    const type = require('./types/'+object);
    const model = require('../models/'+object);

    queries[object] = singular(object, type, model);
    queries[object+'s'] = many(object, type, model);
  });

module.exports = queries;
