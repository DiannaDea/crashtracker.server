const uuid = require('node-uuid');

const { SectorTracker } = require('../models');

const SectorProvider = {
  create: async (sectorParams) => {
    const id = uuid.v4();
    const sector = await SectorTracker.create({
      id,
      ...sectorParams,
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
