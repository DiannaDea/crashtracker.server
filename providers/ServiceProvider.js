const { Service } = require('../models');

const ServiceProvider = {
  create: (deviceId, serviceParams) => Service.create({
    date: new Date(),
    deviceId,
    ...serviceParams,
  }),
  getDevicePrevServices: deviceId => Service.findAll({
    where: {
      deviceId,
    },
  }),
};

module.exports = ServiceProvider;
