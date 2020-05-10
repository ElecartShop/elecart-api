const env = process.env.NODE_ENV || 'development',
    config = require('./config')[env],
    mongoose = require('mongoose');

module.exports = function (callback) {
    if (!callback) {
      callback = function() {}
    }

    mongoose.Promise = global.Promise;
    const db = mongoose.connect(config.db, {useUnifiedTopology: true});

    mongoose.connection.on('error', function () {
        console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
        callback();
    }).on('open', function () {
        console.log('Connection extablised with MongoDB');
        callback();
    }).catch(function(error) {
      console.log(error);
      callback();
    });

    return mongoose;
};
