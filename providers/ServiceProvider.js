const { Service } = require('../models');

const ServiceProvider = {
  create: (deviceId, serviceParams) => Service.create({
    date: new Date(),
    deviceId,
    ...serviceParams,
  }),
  update: (searchParams, updateParams) => Service.update(updateParams, { where: searchParams }),
  getDevicePrevServices: deviceId => Service.findAll({
    where: {
      deviceId,
    },
  }),
};

module.exports = ServiceProvider;
