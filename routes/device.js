const router = require('koa-joi-router');
const { deviceTypes } = require('../consts/enums');
const DeviceController = require('../controllers/DeviceController');

const deviceRouter = router();

const { Joi } = router;

deviceRouter.prefix('/api/devices');

deviceRouter.route({
  method: 'post',
  path: '/',
  validate: {
    body: {
      userId: Joi.string().required(),
      name: Joi.string().required(),
      type: Joi.string().valid(deviceTypes),
      model: Joi.string(),
      description: Joi.string(),
      serviceInterval: Joi.number().required(),
      dateLastService: Joi.date().required(),
      notifyBeforeService: Joi.number().required(),
    },
    type: 'json',
  },
  handler: DeviceController.create,
});

deviceRouter.route({
  method: 'get',
  path: '/:id/sectors',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  handler: DeviceController.getAllSectors,
});

deviceRouter.route({
  method: 'get',
  path: '/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  handler: DeviceController.getOne,
});

deviceRouter.route({
  method: 'delete',
  path: '/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  handler: DeviceController.deleteDevice,
});

module.exports = deviceRouter;
