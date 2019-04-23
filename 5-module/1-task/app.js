const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const subscribers = [];

router.get('/subscribe', async (ctx, next) => {
    const message = await new Promise((resolve) => {
      subscribers.push(resolve.bind(this));
    });

    ctx.status = 200;
    ctx.body = message;
  }
);

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) {
    ctx.status = 204;
    ctx.body = 'No message';
    return;
  }

  let size = subscribers.length;
  while (size--) {
    subscribers.pop()(message);
  }

  ctx.status = 200;
  ctx.body = 'Success';
});

app.use(router.routes());

module.exports = app;
