const router = require('koa-joi-router');
const SectorController = require('../controllers/SectorController');

const sectorTrackerRouter = router();
const { Joi } = router;

sectorTrackerRouter.prefix('/api/sectors');

sectorTrackerRouter.route({
  method: 'post',
  path: '/',
  validate: {
    body: {
      deviceId: Joi.string().required(),
      sectorTrackers: Joi.array().items(Joi.object({
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
  path: '/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  handler: SectorController.getOne,
});

module.exports = sectorTrackerRouter;
