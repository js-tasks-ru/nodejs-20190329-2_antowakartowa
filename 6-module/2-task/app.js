const Koa = require('koa');
const Router = require('koa-router');
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('./models/User');


const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const handleError = (error, ctx) => {
  const {errors} = error;
  ctx.status = 400;
  ctx.body = {
    errors: errors
      ? Object.keys(errors).reduce((errObj, key) => ({...errObj, [key]: errors[key].message}), {})
      : error.message,
  };
};

const router = new Router();

router.get('/users', async (ctx) => {
  const users = await User.find({});
  ctx.body = users;
});

router.get('/users/:id', async (ctx) => {
  try {
    const user = await User.findOne({_id: new ObjectId(ctx.params.id)});

    ctx.status = user ? 200 : 404;
    ctx.body = user || 'User not found';
  } catch (error) {
    handleError(error, ctx);
  }
});

router.patch('/users/:id', async (ctx) => {
  const {email, displayName} = ctx.request.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
        {_id: new ObjectId(ctx.params.id)},
        {email, displayName},
        {
          omitUndefined: true,
          runValidators: true,
          new: true,
        }
    );

    ctx.status = 200;
    ctx.body = updatedUser;
  } catch (error) {
    handleError(error, ctx);
  }
});

router.post('/users', async (ctx) => {
  const {email, displayName} = ctx.request.body;

  try {
    const newUser = await User.create({email, displayName});

    ctx.status = 200;
    ctx.body = newUser;
  } catch (error) {
    handleError(error, ctx);
  }
});

router.delete('/users/:id', async (ctx) => {
  try {
    const {deletedCount, ok} = await User.deleteOne({_id: new ObjectId(ctx.params.id)});
    const isDeleted = !!(deletedCount && ok);

    ctx.status = isDeleted ? 200 : 404;
    ctx.body = isDeleted ? 'User deleted' : 'User not found';
  } catch (error) {
    handleError(error, ctx);
  }
});

app.use(router.routes());

module.exports = app;
