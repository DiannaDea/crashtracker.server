const router = require('koa-joi-router');
const SectorTrackerController = require('../controllers/SectorTrackerController');

const sectorTrackerRouter = router();
const { Joi } = router;

sectorTrackerRouter.prefix('/api/sectors');

sectorTrackerRouter.route({
  method: 'post',
  path: '/',
  validate: {
    body: {
      sectorTrackers: Joi.array().items(Joi.object({
        deviceId: Joi.number().required(),
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
  handler: SectorTrackerController.create,
});

module.exports = sectorTrackerRouter;
