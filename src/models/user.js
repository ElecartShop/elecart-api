const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
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
    required: false,
    select: false
  }
});

schema.pre('save', function(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function(err, salt) { // TODO: Change this salt
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

schema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

const Model = mongoose.model('User', schema);
module.exports = {};
module.exports.Model = Model;

const ModelTC = new composeWithMongoose(Model);

ModelTC.removeField('password');

const account = require('./account');
ModelTC.addRelation('account', {
  resolver: () => account.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.account_id }),
    skip: null,
    sort: null
  },
  projection: { account_id: true }
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
  resolve: async ({args, context}) => {
    const user = await Model.findOne({ name: args.identity });

    if(!user) {
      throw new Error('User/Password combination is wrong.');
    }

    // TODO: Use compare function instead
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
        token
      }
    };
  }
});

ModelTC.createableOnly = true;

module.exports.ModelTC = ModelTC;
