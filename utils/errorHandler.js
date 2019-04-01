const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error.name === 'ClientError') ctx.send(400, error.message);
    else if (error.name === 'ServerError') ctx.send(500, error.message);
    else ctx.send(500, error.message);
  }
};

module.exports = errorHandler;
