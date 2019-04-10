const Koa = require('koa');
const respond = require('koa-respond');
const logger = require('koa-logger');
const cors = require('@koa/cors');

const { routes } = require('./routes');
const errorHandler = require('./utils/errorHandler.js');

const app = new Koa();

require('./services/postgresConnection');

app.use(errorHandler);
app.use(cors());
app.use(respond());
app.use(logger());

routes.forEach(route => app.use(route));

module.exports = app;
