const DeviceProvider = require('../providers/DeviceProvider');
const UserProvider = require('../providers/UserProvider');
const errors = require('../consts/customErrors.js');

const DeviceController = {
  create: async (ctx) => {
    const { userId, ...deviceParams } = ctx.request.body;

    const user = await UserProvider.checkIfExists(userId);
    if (!user) throw errors.ClientError(`No user with such id: ${userId}`);

    const device = await DeviceProvider.create({ userId, ...deviceParams });
    if (!device) throw errors.ServerError('Unable to create device');

    return ctx.send(200, device);
  },
  update(ctx) {
    return ctx.send(200, 'Update device');
  },
  getOne(ctx) {
    return ctx.send(200, 'Get one device');
  },
  getAll(ctx) {
    return ctx.send(200, 'Get all devices');
  },
};

module.exports = DeviceController;
