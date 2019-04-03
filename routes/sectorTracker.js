const router = require('koa-joi-router');
const SectorController = require('../controllers/SectorController');

const sectorTrackerRouter = router();
const { Joi } = router;

sectorTrackerRouter.prefix('/api/sectors');

sectorTrackerRouter.route({
  method: 'post',
  path: '/:uuid/critical',
  validate: {
    params: {
      uuid: Joi.string().required(),
    },
    body: {
      timeExcess: Joi.number().required(),
    },
    type: 'json',
  },
  handler: SectorController.setCriticalSituation,
});

sectorTrackerRouter.route({
  method: 'post',
  path: '/',
  validate: {
    body: {
      deviceId: Joi.string().required(),
      sectorTrackers: Joi.array().items(Joi.object({
        uuid: Joi.string().required(),
        name: Joi.string().required(),
        number: Joi.number().required(),
        location: Joi.string(),
        maxTemperature: Joi.number().required(),
        minTemperature: Joi.number().required(),
        trackerSetupDate: Joi.date().required(),
        maxTimeExcess: Joi.number().required(),
      })),
    },
    type: 'json',
  },
  handler: SectorController.create,
});

sectorTrackerRouter.route({
  method: 'get',
  path: '/',
  handler: SectorController.getWorkDetails,
});

sectorTrackerRouter.route({
  method: 'get',
  path: '/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  handler: SectorController.getOne,
});

sectorTrackerRouter.route({
  method: 'put',
  path: '/temperatures',
  validate: {
    body: {
      sectorTemperatures: Joi.array().items(Joi.object({
        uuid: Joi.string().required(),
        currentTemp: Joi.number().required(),
      })),
    },
    type: 'json',
  },
  handler: SectorController.updateCurrentTemperatures,
});

module.exports = sectorTrackerRouter;
