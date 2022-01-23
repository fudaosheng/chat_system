const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const { registryMiddlewares } = require('../middleware/index');
const { registryServices } = require('../service');
const { registryExtensions } = require('../extension');
const { registryRoutes } = require('../router');
const { registryControllers } = require('../controller');
const wss = require('./websocket');

const app = new Koa();

app.registryMiddlewares = registryMiddlewares;
app.registryRoutes = registryRoutes;
app.registryServices = registryServices;
app.registryExtensions = registryExtensions;
app.registryControllers = registryControllers;

app.use(bodyparser());
app.registryMiddlewares();
app.registryServices();
app.registryExtensions();
app.registryControllers();
app.registryRoutes();
app.wss = wss;

module.exports = app;
