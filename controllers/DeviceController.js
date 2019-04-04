const DeviceProvider = require('../providers/DeviceProvider');
const DeviceStatusProvider = require('../providers/DeviceStatusProvider');
const UserProvider = require('../providers/UserProvider');
const SectorProvider = require('../providers/SectorProvider');
const errors = require('../consts/customErrors.js');

const DeviceController = {
  create: async (ctx) => {
    const { userId, ...deviceParams } = ctx.request.body;

    const user = await UserProvider.checkIfExists(userId);
    if (!user) throw new errors.ClientError(`No user with such id: ${userId}`);

    try {
      const device = await DeviceProvider.create({ userId, ...deviceParams });
      if (!device) throw new errors.ServerError('Unable to create device');

      await DeviceStatusProvider.create(device.id);
      return ctx.send(200, device);
    } catch (error) {
      throw new errors.ServerError('Error in creting device', error);
    }
  },
  getOne: async (ctx) => {
    const { id } = ctx.params;

    const device = await DeviceProvider.checkIfExists(id);
    if (!device) throw new errors.ClientError(`No device with such id: ${id}`);

    return ctx.send(200, device);
  },
  getAllSectors: async (ctx) => {
    const { id } = ctx.params;

    const device = await DeviceProvider.checkIfExists(id);
    if (!device) throw new errors.ClientError(`No device with such id: ${id}`);

    const sectors = await SectorProvider.findAllByParams({ deviceId: id });
    if (!sectors || !sectors.length) throw new errors.ClientError(`No sectors for device with id: ${id}`);

    return ctx.send(200, sectors);
  },
};

module.exports = DeviceController;
