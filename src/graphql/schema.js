const grapqlCompose = require('graphql-compose');
const schemaComposer = new grapqlCompose.SchemaComposer();

const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
var queries = {};
var mutations = {};

fs
  .readdirSync(__dirname+'/../models')
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const object = file.slice(0, -3);
    const {Model, ModelTC} = require('../models/'+object);

    const queries = {
      [object+'ById']: ModelTC.getResolver('findById'),
      [object+'ByIds']: ModelTC.getResolver('findByIds'),
      [object+'One']: ModelTC.getResolver('findOne'),
      [object+'Many']: ModelTC.getResolver('findMany'),
      [object+'Count']: ModelTC.getResolver('count'),
      [object+'Connection']: ModelTC.getResolver('connection'),
      [object+'Pagination']: ModelTC.getResolver('pagination'),
    };

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

    schemaComposer.Query.addFields(queries);
    schemaComposer.Mutation.addFields(mutations);
  });

module.exports = schemaComposer.buildSchema();
