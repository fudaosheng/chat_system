const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const { registryMiddlewares } = require('../middleware/index');
const { registryRoutes } = require('../router');
const { registryServices } = require('../service');
const { registryExtensions } = require('../extension');

const app = new Koa();

app.registryMiddlewares = registryMiddlewares;
app.registryRoutes = registryRoutes;
app.registryServices = registryServices;
app.registryExtensions = registryExtensions;

app.use(bodyparser());
app.registryMiddlewares();
app.registryRoutes();
app.registryServices();
app.registryExtensions();

module.exports = app;
