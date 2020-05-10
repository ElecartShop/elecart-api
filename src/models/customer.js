const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  birthday: {
    type: Date,
    required: false
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
  const customer = this;

  if (!customer.isModified('password')) {
    return next();
  }

  bcrypt.genSalt("USEENVSALT", function(err, salt) { // TODO: Change this salt
    if (err) return next(err);

    bcrypt.hash(customer.password, salt, function(err, hash) {
      if (err) return next(err);

      customer.password = hash;
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

schema.index({shop_id: 1, name: 1}, {unique: true});

module.exports = {};
module.exports.Model = mongoose.model('Customer', schema);

const ModelTC = new composeWithMongoose(module.exports.Model);

ModelTC.removeField('password');

const shop = require('./shop');
ModelTC.addRelation('shop', {
  resolver: () => shop.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.shop_id }),
    skip: null,
    sort: null,
  },
  projection: { shop_id: true }
});

ModelTC.addResolver({
  kind: 'mutation',
  name: 'loginCustomer',
  args: {
    identity: 'String!',
    password: 'String!'
  },
  type: ModelTC.getResolver('updateById').getType(),
  resolve: async ({args, context}) => {
    const customer = await module.exports.Model.findOne({ name: args.identity });

    if(!customer) {
      throw new Error('User/Password combination is wrong.');
    }

    // TODO: Use compare function instead
    const isEqual = await bcrypt.compare(args.password, customer.password);
    if(!isEqual) {
      throw new Error('User/Password combination is wrong.');
    }
    const token = jwt.sign({customer_id: customer._id}, 'moveSecretToENV', {
      expiresIn: '8h'
    });

    return {
      recordId: customer._id,
      record: {
        name: customer.name,
        token
      }
    };
  }
});

module.exports.ModelTC = ModelTC;
