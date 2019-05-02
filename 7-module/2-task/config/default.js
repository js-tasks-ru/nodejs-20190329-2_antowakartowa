module.exports = {
  mongodb: {
    uri: 'mongodb://localhost/chat_app',
  },
  providers: {
    github: {
      app_id: process.env.GITHUB_APP_ID || '962806fc5eec519528f6',
      app_secret: process.env.GITHUB_APP_SECRET || '453bd4b06d501acca5540df350beb1ae778edd8c',
      callback_uri: 'http://localhost:3000/oauth/github',
      options: {
        scope: ['user:email']
      }
    },
    facebook: {
      app_id: process.env.FACEBOOK_APP_ID || '337833273541886',
      app_secret: process.env.FACEBOOK_APP_SECRET || 'd9aa75bee7c3f52d8b63d273ca304182',
      callback_uri: 'http://localhost:3000/oauth/facebook',
      options: {
        scope: ['email']
      }
    },
    vkontakte: {
      app_id: process.env.VKONTAKTE_APP_ID || '6966473',
      app_secret: process.env.VKONTAKTE_APP_SECRET || 'l6tICHVaz5g7uNQHnzMu',
      callback_uri: 'http://localhost:3000/oauth/vkontakte',
      options: {
        scope: ['email']
      }
    }
  }
};
