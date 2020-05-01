const GraphQLObjectType = require('graphql').GraphQLObjectType;
const GraphQLList = require('graphql').GraphQLList;
const GraphQLNonNull = require('graphql').GraphQLNonNull;
const GraphQLID = require('graphql').GraphQLID;
const GraphQLString = require('graphql').GraphQLString;

module.exports = {
  name: 'user',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    account_id: {
      type: GraphQLString,
      reuired: true
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
