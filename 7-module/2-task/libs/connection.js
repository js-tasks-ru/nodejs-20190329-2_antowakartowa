const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
// const config = require('config');
const config = require('./../config/default');
const get = require('lodash/get');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.plugin(beautifyUnique);

module.exports = mongoose.createConnection(get(config, 'mongodb.uri'));
