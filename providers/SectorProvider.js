const uuid = require('node-uuid');

const { sectorStatuses } = require('../consts/enums');
const { SectorTracker } = require('../models');

const SectorProvider = {
  create: async (sectorParams) => {
    const id = uuid.v4();
    const sector = await SectorTracker.create({
      id,
      ...sectorParams,
      status: parseInt(Object.keys(sectorStatuses).sort((a, b) => a - b)[0], 10),
    });

    return sector;
  },
  checkIfExists: async id => SectorTracker.findOne({
    where: {
      id,
    },
  }),
  findAllByParams: async sectorParams => SectorTracker.findAll({
    where: {
      ...sectorParams,
    },
  }),
};

module.exports = SectorProvider;
