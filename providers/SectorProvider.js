const uuid = require('node-uuid');

const { sectorStatuses } = require('../consts/enums');
const { SectorTracker } = require('../models');

const SectorProvider = {
  create: (sectorParams) => {
    const id = uuid.v4();
    return SectorTracker.create({
      id,
      ...sectorParams,
      status: parseInt(Object.keys(sectorStatuses).sort((a, b) => a - b)[0], 10),
    });
  },
  checkIfExists: id => SectorTracker.findOne({
    where: {
      id,
    },
  }),
  findAllByParams: sectorParams => SectorTracker.findAll({
    where: {
      ...sectorParams,
    },
  }),
  update: (sectorId, updParams) => SectorTracker.update(updParams, {
    where: { id: sectorId },
  }),
};

module.exports = SectorProvider;
