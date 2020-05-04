const mongoose = require('mongoose');
const composeWithMongoose = require('graphql-compose-mongoose').composeWithMongoose;
const Schema = mongoose.Schema;

var schema = new Schema({
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
    required: true
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
    required: false
  }
});

schema.index({shop_id: 1, name: 1}, {unique: true});

module.exports = {};
module.exports.Model = mongoose.model('Customer', schema);

var ModelTC = new composeWithMongoose(module.exports.Model);

const shop = require('./shop');
ModelTC.addRelation('shop', {
  resolver: () => shop.ModelTC.getResolver('findOne'),
  prepareArgs: {
    filter: (source) => ({ _id: source.shop_id }),
    skip: null,
    sort: null,
  },
  projection: { shop_id: true },
});

ModelTC.addResolver({
  kind: 'mutation',
  name: 'loginCustomer',
  args: {
    identity: 'String!',
    password: 'String!'
  },
  type: ModelTC.getResolver('updateById').getType(),
  resolve: async({args, context}) => {
    let customer = await module.exports.Model.findOne({ name: args.identity });

    if(!customer) {
      throw new Error('User/Password combination is wrong.');
    }

    const isEqual = await bcrypt.compare(args.password, customer.password);
    if(!isEqual) {
      throw new Error('User/Password combination is wrong.');
    }
    const token = jwt.sign({user_id: user._id}, 'moveSecretToENV', {
      expiresIn: '8h'
    });

    return {
      recordId: customer._id,
      record: {
        name: customer.name,
        token: token
      }
    };
  }
});

module.exports.ModelTC = ModelTC;
