const uuid = require('node-uuid');

const { Device } = require('../models');
const { deviceStatuses } = require('../consts/enums');

const DeviceProvider = {
  create: (deviceParams) => {
    const id = uuid.v4();
    return Device.create({
      id,
      ...deviceParams,
      status: parseInt(Object.keys(deviceStatuses).sort((a, b) => a - b)[0], 10),
    });
  },
  checkIfExists: id => Device.findOne({
    where: {
      id,
    },
  }),
  findAllByParams: deviceParams => Device.findAll({
    where: {
      ...deviceParams,
    },
  }),
  update: (deviceId, updParams) => Device.update(updParams, {
    where: { id: deviceId },
  }),
};

module.exports = DeviceProvider;
