const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const { registryMiddlewares } = require('../middleware/index');
const { registryRoutes } = require('../router');

const app = new Koa();

app.registryMiddlewares = registryMiddlewares;
app.registryRoutes = registryRoutes;

app.use(bodyparser());
app.registryMiddlewares();
app.registryRoutes();

module.exports = app;
