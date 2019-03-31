const uuid = require('node-uuid');

const { Device } = require('../models');
const { deviceStatuses } = require('../consts/enums');

const DeviceProvider = {
  create: async (deviceParams) => {
    const id = uuid.v4();
    const device = await Device.create({
      id,
      ...deviceParams,
      status: parseInt(Object.keys(deviceStatuses).sort((a, b) => a - b)[0], 10),
    });

    return device;
  },
};

module.exports = DeviceProvider;
