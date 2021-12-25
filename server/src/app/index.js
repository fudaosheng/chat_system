const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const app = new Koa();

const KoaRouter = require('koa-router');
const router = new KoaRouter();
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', ctx.headers.origin);
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Request-Method', 'PUT,POST,GET,DELETE,OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, cc');
  if (ctx.method === 'OPTIONS') {
    ctx.status = 204;
    return;
  }
  await next();
});
router.get('/test/login', ctx => {
  ctx.body = 'hello';
});
app.use(bodyparser());
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
