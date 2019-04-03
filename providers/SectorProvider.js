const uuid = require('node-uuid');
const pick = require('lodash.pick');
const omit = require('lodash.omit');

const { sectorStatuses } = require('../consts/enums');
const { SectorTracker } = require('../models');
const TrackerStatusProvider = require('../providers/TrackerStatusProvider');

const SectorProvider = {
  create: (sectorParams) => {
    const id = uuid.v4();
    return SectorTracker.create({
      id,
      ...sectorParams,
      status: parseInt(Object.keys(sectorStatuses).sort((a, b) => a - b)[0], 10),
    });
  },
  getOneFullInfo: async (sectorParams) => {
    const sector = await SectorTracker.findOne({
      where: {
        ...sectorParams,
      },
    });

    const sectorStatus = await TrackerStatusProvider.checkIfExists(sector.id);

    return {
      ...omit(sector.dataValues, ['status']),
      status: {
        number: sector.status,
        name: sectorStatuses[sector.status],
        ...pick(sectorStatus.dataValues, ['currentTemp', 'timeExcess']),
      },
    };
  },
  checkIfExists: async sectorParams => SectorTracker.findOne({
    where: {
      ...sectorParams,
    },
  }),
  findAllByParams: async (sectorParams) => {
    const sectors = await SectorTracker.findAll({
      where: {
        ...sectorParams,
      },
    });

    return Promise.all(sectors.map(async (sector) => {
      const sectorStatus = await TrackerStatusProvider.checkIfExists(sector.id);

      return {
        ...omit(sector.dataValues, ['status']),
        status: {
          number: sector.status,
          name: sectorStatuses[sector.status],
          ...pick(sectorStatus.dataValues, ['currentTemp', 'timeExcess']),
        },
      };
    }));
  },
  update: (sectorId, updParams) => SectorTracker.update(updParams, {
    where: { id: sectorId },
  }),
};

module.exports = SectorProvider;
