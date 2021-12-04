const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const cors = require('koa-cors');

const app = new Koa();

const KoaRouter = require('koa-router');
const router = new KoaRouter();
router.get('/login', ctx => {
  console.log('hello');
  ctx.body = 'hello';
});

app.use(cors());
app.use(bodyparser());
app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
