var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;

module.exports = {
  name: 'shop',
  noMany: true,
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    name: {
      type: GraphQLString
    },
    created: {
      type: GraphQLString
    },
    modified: {
      type: GraphQLString
    },
    deleted: {
      type: GraphQLString
    }
  }
};
