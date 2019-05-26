const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const uuid = require('uuid/v4');
const Router = require('koa-router');
const handleMongooseValidationError = require('./libs/validationErrors');
const Session = require('./models/Session');
const mustBeAuthenticated = require('./libs/mustBeAuthenticated');

const app = new Koa();

const handleError = (error, ctx) => {
  const {errors} = error;
  ctx.status = 400;
  ctx.body = {
    errors: errors
      ? Object.keys(errors).reduce((errObj, key) => ({...errObj, [key]: errors[key].message}), {})
      : error.message,
  };
};

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

app.use((ctx, next) => {
  ctx.login = async function login(user) {
    const token = uuid();
    Session.create({
      token,
      lastVisit: new Date(),
      user: user._id,
    });

    return token;
  };

  return next();
});

app.use(async (ctx, next) => {
  const token = (ctx.request.headers.authorization || '').split(' ')[1];

  if (token) {
    let session;
    try {
      session = await Session.findOne({ token }).populate('user');
    } catch (error) {
      handleError(error);
    }

    if (session) {
      session.set('lastVisit', new Date());
      session.markModified('lastVisit');
      session.save();

      ctx.user = session.user;
    } else {
      ctx.throw(401, 'Неверный аутентификационный токен');
    }
  }

  return next();
})

const router = new Router({prefix: '/api'});

router.use(async (ctx, next) => {
  const header = ctx.request.get('Authorization');
  if (!header) return next();

  return next();
});

router.post('/login', require('./controllers/login'));
router.get('/oauth/:provider', require('./controllers/oauth').oauth);
router.post('/oauth_callback', handleMongooseValidationError, require('./controllers/oauth').oauthCallback);
router.post('/register', handleMongooseValidationError, require('./controllers/register'));
router.post('/confirm', require('./controllers/confirm'));

router.get('/me', mustBeAuthenticated, require('./controllers/me'));

app.use(router.routes());

// this for HTML5 history in browser
const index = fs.readFileSync(path.join(__dirname, 'public/index.html'));
app.use(async (ctx, next) => {
  if (!ctx.url.startsWith('/api')) {
    ctx.set('content-type', 'text/html');
    ctx.body = index;
  }
});

module.exports = app;
