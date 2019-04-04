const { DeviceStatus } = require('../models');

const DeviceStatusProvider = {
  create: deviceId => DeviceStatus.create({
    deviceId,
    hours: 0,
    minutes: 0,
  }),
  update: (deviceId, updParams) => DeviceStatus.update(updParams, {
    where: { deviceId },
  }),
  checkIfExists: deviceId => DeviceStatus.findOne({
    where: {
      deviceId,
    },
  }),
};

module.exports = DeviceStatusProvider;
