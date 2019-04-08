const DeviceProvider = require('../providers/DeviceProvider');
const StatProvider = require('../providers/StatProvider');
const errors = require('../consts/customErrors.js');

const StatController = {
  getServiceStat: async (ctx) => {
    const { deviceId } = ctx.params;

    const device = await DeviceProvider.checkIfExists(deviceId);
    if (!device) throw new errors.ClientError(`No device with such id: ${deviceId}`);

    try {
      const serviceStat = await StatProvider.getServiceStat(deviceId);
      return ctx.send(200, serviceStat[0]);
    } catch (error) {
      throw new errors.ServerError(`Error in getting service stat for device, error: ${error.message}`);
    }
  },
  getSectorsStat: async (ctx) => {
    const { deviceId } = ctx.params;

    const device = await DeviceProvider.checkIfExists(deviceId);
    if (!device) throw new errors.ClientError(`No device with such id: ${deviceId}`);

    try {
      const sectorsStat = await StatProvider.getSectorsStat(deviceId);
      return ctx.send(200, sectorsStat[0]);
    } catch (error) {
      throw new errors.ServerError(`Error in getting sectors stat for device, error: ${error.message}`);
    }
  },
};

module.exports = StatController;
