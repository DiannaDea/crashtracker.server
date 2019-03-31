const Koa = require('koa');
const respond = require('koa-respond');
const logger = require('koa-logger');

const { routes } = require('./routes');
const errorHandler = require('./utils/errorHandler.js');

const app = new Koa();

require('./services/postgresConnection');
require('./services/mongoConnection');

app.use(respond());
app.use(logger());

routes.forEach(route => app.use(route));

app.use(errorHandler);

module.exports = app;
