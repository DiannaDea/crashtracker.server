const router = require('koa-joi-router');

const StatController = require('../controllers/StatController');

const statisticsRouter = router();

const { Joi } = router;

statisticsRouter.prefix('/api/statistics');

statisticsRouter.route({
  method: 'get',
  path: '/:deviceId/service',
  validate: {
    params: {
      deviceId: Joi.string().required(),
    },
  },
  handler: StatController.getServiceStat,
});

statisticsRouter.route({
  method: 'get',
  path: '/:deviceId/sectors',
  validate: {
    params: {
      deviceId: Joi.string().required(),
    },
  },
  handler: StatController.getSectorsStat,
});

module.exports = statisticsRouter;
