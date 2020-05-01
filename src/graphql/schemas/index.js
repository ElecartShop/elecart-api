const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLString = require('graphql').GraphQLString;
const GraphQLList = require('graphql').GraphQLList;

class Schema {
  single(object, type, model) {
    return {
      name: object,
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

  many(object, type, model) {
    return {
      name: object+'s',
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

  create(object, type, model) {
    return {
      name: object+'Create',
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
        return data;
      }
    };
  }

  update(object, type, model) {
    return {
      name: object+'Update',
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

  remove(object, type, model) {
    return {
      name: object+'Delete',
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
}

module.exports = new Schema();
