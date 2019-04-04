const { Service } = require('../models/service');

const ServiceProvider = {
  create: (deviceId, serviceParams) => Service.create({
    deviceId,
    ...serviceParams,
  }),
  getDevicePrevServices: deviceId => Service.find({
    where: {
      deviceId,
    },
  }),
};

module.exports = ServiceProvider;
