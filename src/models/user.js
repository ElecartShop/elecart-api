const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Date,
    required: false
  }
});

module.exports = {};
module.exports.Model = mongoose.model('User', schema);

var ModelTC = new composeWithMongoose(module.exports.Model);

const account = require('./account');
ModelTC.addRelation('account', {
  resolver: () => account.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.account_id }),
    skip: null,
    sort: null,
  },
  projection: { account_id: true },
});

ModelTC.addFields({
  token: {
    type: 'String',
    description: 'Token of authenticated user.'
  }
});

ModelTC.addResolver({
  kind: 'mutation',
  name: 'loginUser',
  args: {
    identity: 'String!',
    password: 'String!'
  },
  type: ModelTC.getResolver('updateById').getType(),
  resolve: async({args, context}) => {
    let user = await module.exports.Model.findOne({ name: args.identity });

    if(!user) {
      throw new Error('User/Password combination is wrong.');
    }

    const isEqual = await bcrypt.compare(args.password, user.password);
    if(!isEqual) {
      throw new Error('User/Password combination is wrong.');
    }
    const token = jwt.sign({user_id: user._id}, 'moveSecretToENV', {
      expiresIn: '8h'
    });

    return {
      recordId: user._id,
      record: {
        name: user.name,
        token: token
      }
    };
  }
});

ModelTC.needsAuthorized = true;

module.exports.ModelTC = ModelTC;
