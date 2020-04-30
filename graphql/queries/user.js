var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLList = require('graphql').GraphQLList;
var UserModel = require('../../models/user');
var UserType = require('../types/user');

module.exports = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  resolve(root, params) {
    const user = UserModel.findById(params.id).exec();
    if (!user) {
      throw new Error('Error');
    }
    return user;
  }
};
