const { TrackerStatus } = require('../models');

const TrackerStatusProvider = {
  create: sectorId => TrackerStatus.create({
    sectorId,
    currentTemp: 0,
    timeExcess: 0,
    criticalCount: 0,
    avgTemperature: 0,
    maxTemperature: 0,
    minTemperature: 0,
    hours: 0,
    minutes: 0,
  }),
  update: (sectorId, updParams) => TrackerStatus.update(updParams, {
    where: { sectorId },
  }),
  checkIfExists: sectorId => TrackerStatus.findOne({
    where: {
      sectorId,
    },
  }),
};

module.exports = TrackerStatusProvider;
