// TODO: Figure out what the connection query is and learn how to test
// TODO: Add in indexes
// TODO: Add customer tags
// TODO: Go through models and be restrictive with data returns

const grapqlCompose = require('graphql-compose');
const schemaComposer = new grapqlCompose.SchemaComposer();

const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);

function customer_access(resolve, source, args, context, info) {
  if (context.req.customer_authorized || context.req.user_authorized || context.req.admin_authorized) {
    return resolve(source, args, context, info);
  }

  throw new Error('You must be authorized.');
}
function user_access(resolve, source, args, context, info) {
  if (context.req.user_authorized || context.req.admin_authorized) {
    return resolve(source, args, context, info);
  }

  throw new Error('You must be authorized.');
}
function admin_access(resolve, source, args, context, info) {
  if (context.req.admin_authorized) {
    return resolve(source, args, context, info);
  }

  throw new Error('You must be authorized.');
}

fs
  .readdirSync(__dirname+'/../models')
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const object = file.slice(0, -3);
    const {ModelTC} = require('../models/'+object);

    const queries = {};
    ModelTC.queries.forEach((query) => {
      const resolvers = [];
      switch (query.access) {
        case 'anonymous':
        break;
        case 'customer':
          resolvers.push(customer_access);
        break;
        case 'user':
          resolvers.push(user_access);
        break;
        case 'admin':
          resolvers.push(admin_access);
        break;
      }

      queries[object+query.call] = ModelTC.getResolver(query.resolver, resolvers);
    });

    if (ModelTC.hasFindByURL) {
      queries[object+'ByURL'] = ModelTC.getResolver('findByURL');
    }

    const mutations = {};
    ModelTC.mutations.forEach((mutation) => {
      const resolvers = [];
      switch (mutation.access) {
        case 'anonymous':
        break;
        case 'customer':
          resolvers.push(customer_access);
        break;
        case 'user':
          resolvers.push(user_access);
        break;
        case 'admin':
          resolvers.push(admin_access);
        break;
      }

      mutations[object+mutation.call] = ModelTC.getResolver(mutation.resolver, resolvers);
    });

    schemaComposer.Query.addFields(queries);
    schemaComposer.Mutation.addFields(mutations);

    if (object === 'admin') {
      schemaComposer.Mutation.addFields({
        loginAdmin: ModelTC.getResolver('loginAdmin'),
      });
    }
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
