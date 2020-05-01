const fs = require('fs');
const path = require('path');

const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLList = require('graphql').GraphQLList;

const basename = path.basename(__filename);
var queries = {};
var mutations = {};

fs
  .readdirSync(__dirname+'/types')
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var schemaClass;
    if (fs.existsSync('schemas/'+file)) {
      schemaClass = require('./schemas/'+file);
    } else {
      schemaClass = require('./schemas/index');
    }

    const object = file.slice(0, -3);
    const type = require('./types/'+object);
    const model = require('../models/'+object);
    const objectType = new GraphQLObjectType(type);

    queries[object] = schemaClass.single(object, objectType, model);
    if (!type.noMany) {
      queries[object+'s'] = schemaClass.many(object, objectType, model);
    }

    mutations[object+'Create'] = schemaClass.create(object, objectType, model);
    mutations[object+'Update'] = schemaClass.update(object, objectType, model);
    mutations[object+'Delete'] = schemaClass.remove(object, objectType, model);
  });

module.exports = {queries, mutations};
