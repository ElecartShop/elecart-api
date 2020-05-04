const grapqlCompose = require('graphql-compose');
const schemaComposer = new grapqlCompose.SchemaComposer();

const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
var queries = {};
var mutations = {};

async function authMiddleware(resolve, source, args, context, info) {
  if (context.req.authorized) {
    return resolve(source, args, context, info);
  }

  throw new Error('You must be authorized.');
}

fs
  .readdirSync(__dirname+'/../models')
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const object = file.slice(0, -3);
    const {Model, ModelTC} = require('../models/'+object);

    var resolvers = [];
    if (ModelTC.needsAuthorized) {
      resolvers.push(authMiddleware);
    }

    var queries = {};
    var query_sets = [
      {call: 'ById', resolver: 'findById'},
      {call: 'ByIds', resolver: 'findByIds'},
      {call: 'One', resolver: 'findOne'},
      {call: 'Many', resolver: 'findMany'},
      {call: 'Count', resolver: 'count'},
      {call: 'Connection', resolver: 'connection'},
      {call: 'Pagination', resolver: 'pagination'}
    ];

    query_sets.forEach((query) => {
      queries[object+query.call] = ModelTC.getResolver(query.resolver, resolvers);
    });


    var mutations = {};
    var mutation_sets = [
      {call: 'CreateOne', resolver: 'createOne'},
      {call: 'CreateMany', resolver: 'createMany'},
      {call: 'UpdateById', resolver: 'updateById'},
      {call: 'UpdateOne', resolver: 'updateOne'},
      {call: 'UpdateMany', resolver: 'updateMany'},
      {call: 'RemoveById', resolver: 'removeById'},
      {call: 'RemoveOne', resolver: 'removeOne'},
      {call: 'RemoveMany', resolver: 'removeMany'}
    ];

    mutation_sets.forEach((mutation) => {
      mutations[object+mutation.call] = ModelTC.getResolver(mutation.resolver, resolvers);
    });

    schemaComposer.Query.addFields(queries);
    schemaComposer.Mutation.addFields(mutations);

    if (object === 'user') {
      schemaComposer.Mutation.addFields({
        loginUser: ModelTC.getResolver('loginUser'),
      });
    }
    if (object === 'customer') {
      schemaComposer.Mutation.addFields({
        loginCustomer: ModelTC.getResolver('loginCustomer'),
      });
    }
  });

module.exports = schemaComposer.buildSchema();
