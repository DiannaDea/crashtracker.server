const { TrackerStatus } = require('../models');

const TrackerStatusProvider = {
  create: sectorId => TrackerStatus.create({
    sectorId,
    currentTemp: 0,
    timeExcess: 0,
  }),
  update: (sectorId, updParams) => TrackerStatus.update(updParams, {
    where: { sectorId },
  }),
};

module.exports = TrackerStatusProvider;
