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

module.exports = serviceRouter;
