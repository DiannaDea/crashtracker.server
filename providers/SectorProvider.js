const uuid = require('node-uuid');
const pick = require('lodash.pick');
const omit = require('lodash.omit');
const moment = require('moment');

const { sectorStatuses } = require('../consts/enums');
const { SectorTracker } = require('../models');
const TrackerStatusProvider = require('../providers/TrackerStatusProvider');
const DeviceProvider = require('../providers/DeviceProvider');

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
  findAll: async sectorParams => SectorTracker.findAll({
    where: {
      ...sectorParams,
    },
  }),
  findAllByParams: async (sectorParams, serviceInterval) => {
    const sectors = await SectorTracker.findAll({
      where: {
        ...sectorParams, // {deviceId}
      },
    });

    return Promise.all(sectors.map(async (sector) => {
      const sectorStatus = await TrackerStatusProvider.checkIfExists(sector.id);
      const [{
        hours,
        minutes,
      }] = (await DeviceProvider.getMaxWorkHoursBySector(sectorParams.deviceId))[0];

      const hoursDiff = serviceInterval - hours;
      const nextServiceDate = (hoursDiff >= 0)
        ? moment().add(hoursDiff, 'h').subtract(minutes, 'm')
        : moment().subtract(hoursDiff * -1, 'h').subtract(minutes, 'm')

      return {
        ...omit(sector.dataValues, ['status']),
        nextServiceDate,
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
