const fs = require('fs');
const path = require('path');

const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLList = require('graphql').GraphQLList;

const basename = path.basename(__filename);
var mutations = {};

function create(object, type, model) {
  return {
    name: 'Mutation',
    type: type,
    args: {
      name: {
        type: new GraphQLNonNull(GraphQLString),
      }
    },
    resolve(root, params) {
      const entity = new model(params);
      const data = entity.save();
      if (!data) {
        throw new Error('Error');
      }
      return data
    }
  };
}

function update(object, type, model) {
  return {
    name: 'Mutation',
    type: type,
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLString)
      },
      name: {
        type: new GraphQLNonNull(GraphQLString),
      }
    },
    resolve(root, params) {
      return model.findByIdAndUpdate(
        params.id,
        { $set: {
          name: params.name
        } },
        { new: true }
      )
        .catch(err => new Error(err));
    }
  };
}

function remove(object, type, model) {
  return {
    name: 'Mutation',
    type: type,
    args: {
      id: {
        name: 'id',
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve(root, params) {
      return model.findByIdAndUpdate(
        params.id,
        { $set: { deleted: Date.now().toString() } },
        { new: true }
      )
        .catch(err => new Error(err));
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

    mutations[object+'Create'] = create(object, type, model);
    mutations[object+'Update'] = update(object, type, model);
    mutations[object+'Delete'] = remove(object, type, model);
  });

module.exports = mutations;
