var mongoose = require('mongoose');
const config = require('./db-config.json');
const ENV = process.env.NODE_ENV || 'development';

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:27017/${config[ENV].dbName}`, {useMongoClient: true});

module.exports = {
  mongoose
};
