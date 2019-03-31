const { ServerError, ClientError } = require('../consts/customErrors');

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof ClientError) ctx.send(400, error);
    else if (error instanceof ServerError) ctx.send(500, error);
    else ctx.send(500, error);
  }
};

module.exports = errorHandler;
