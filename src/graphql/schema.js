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

    var queries;
    if (ModelTC.needsAuthorized) {
      queries = {
        [object+'ById']: ModelTC.getResolver('findById', [authMiddleware]),
        [object+'ByIds']: ModelTC.getResolver('findByIds', [authMiddleware]),
        [object+'One']: ModelTC.getResolver('findOne', [authMiddleware]),
        [object+'Many']: ModelTC.getResolver('findMany', [authMiddleware]),
        [object+'Count']: ModelTC.getResolver('count', [authMiddleware]),
        [object+'Connection']: ModelTC.getResolver('connection', [authMiddleware]),
        [object+'Pagination']: ModelTC.getResolver('pagination', [authMiddleware]),
      };
    } else {
      queries = {
        [object+'ById']: ModelTC.getResolver('findById'),
        [object+'ByIds']: ModelTC.getResolver('findByIds'),
        [object+'One']: ModelTC.getResolver('findOne'),
        [object+'Many']: ModelTC.getResolver('findMany'),
        [object+'Count']: ModelTC.getResolver('count'),
        [object+'Connection']: ModelTC.getResolver('connection'),
        [object+'Pagination']: ModelTC.getResolver('pagination'),
      };
    }

    if (ModelTC.needsAuthorized) {
      const mutations = {
          [object+'CreateOne']: ModelTC.getResolver('createOne', [authMiddleware]),
          [object+'CreateMany']: ModelTC.getResolver('createMany', [authMiddleware]),
          [object+'UpdateById']: ModelTC.getResolver('updateById', [authMiddleware]),
          [object+'UpdateOne']: ModelTC.getResolver('updateOne', [authMiddleware]),
          [object+'UpdateMan']: ModelTC.getResolver('updateMany', [authMiddleware]),
          [object+'RemoveById']: ModelTC.getResolver('removeById', [authMiddleware]),
          [object+'RemoveOne']: ModelTC.getResolver('removeOne', [authMiddleware]),
          [object+'RemoveMany']: ModelTC.getResolver('removeMany', [authMiddleware]),
      };
    } else {
      const mutations = {
          [object+'CreateOne']: ModelTC.getResolver('createOne'),
          [object+'CreateMany']: ModelTC.getResolver('createMany'),
          [object+'UpdateById']: ModelTC.getResolver('updateById'),
          [object+'UpdateOne']: ModelTC.getResolver('updateOne'),
          [object+'UpdateMan']: ModelTC.getResolver('updateMany'),
          [object+'RemoveById']: ModelTC.getResolver('removeById'),
          [object+'RemoveOne']: ModelTC.getResolver('removeOne'),
          [object+'RemoveMany']: ModelTC.getResolver('removeMany'),
      };
    }

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
