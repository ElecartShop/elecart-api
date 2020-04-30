var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLList = require('graphql').GraphQLList;
var UserModel = require('../../models/user');
var UserType = require('../types/user');

module.exports = {
  type: new GraphQLList(UserType),
  resolve() {
    const users = UserModel.find().exec();
    if (!users) {
      throw new Error('Error');
    }
    return users;
  }
};
