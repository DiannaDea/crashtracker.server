const router = require('koa-joi-router');
const ServiceController = require('../controllers/ServiceController');

const serviceRouter = router();

const { Joi } = router;

serviceRouter.prefix('/api/service');

serviceRouter.route({
  method: 'post',
  path: '/:deviceId/start',
  validate: {
    params: {
      deviceId: Joi.string().required(),
    },
  },
  handler: ServiceController.startService,
});

serviceRouter.route({
  method: 'post',
  path: '/:deviceId/stop',
  validate: {
    params: {
      deviceId: Joi.string().required(),
    },
  },
  handler: ServiceController.stopService,
});

module.exports = serviceRouter;
