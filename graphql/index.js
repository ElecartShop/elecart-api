var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var queries = require('./queries');
var mutations = require('./mutations');

module.exports = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: queries
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: mutations
  })
});
