const GithubStrategy = require('passport-github').Strategy;
// const config = require('config');
const config = require('./../../config/default');
const get = require('lodash/get');
const authenticate = require('./authenticate');

module.exports = new GithubStrategy({
    // clientID: config.get('providers.github.app_id'),
    // clientSecret: config.get('providers.github.app_secret'),
    // callbackURL: config.get('providers.github.callback_uri'),
    clientID: get(config, 'providers.github.app_id'),
    clientSecret: get(config, 'providers.github.app_secret'),
    callbackURL: get(config, 'providers.github.callback_uri'),
    scope: ['user:email'],
    session: false,
  }, function(accessToken, refreshToken, profile, done) {
    authenticate('github', get(profile, 'emails[0].value'), profile.username, done);
  }
);
