const Koa = require('koa');
const respond = require('koa-respond');
const logger = require('koa-logger');

const app = new Koa();

require('./services/postgresConnection');
require('./services/mongoConnection');

app.use(respond());
app.use(logger());

app.use(async (ctx) => {
  ctx.send(200, 'Hello World');
});

module.exports = app;
