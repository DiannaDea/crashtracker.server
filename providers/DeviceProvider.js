const uuid = require('node-uuid');

const { Device, sequelize } = require('../models');
const { deviceStatuses } = require('../consts/enums');

const DeviceProvider = {
  create: (deviceParams) => {
    const id = uuid.v4();
    return Device.create({
      id,
      ...deviceParams,
      status: parseInt(Object.keys(deviceStatuses).sort((a, b) => a - b)[0], 10),
    });
  },
  checkIfExists: id => Device.findOne({
    where: {
      id,
    },
  }),
  findAllByParams: deviceParams => Device.findAll({
    where: {
      ...deviceParams,
    },
  }),
  update: (deviceId, updParams) => Device.update(updParams, {
    where: { id: deviceId },
  }),
  getMaxWorkHoursBySector: deviceId => sequelize
    .query(`select hours, minutes from "SectorTrackers" s
            join "TrackerStatuses" ts on s.id = ts."sectorId"
            where "deviceId" = '${deviceId}'
            and "hours" = (
              select max(hours) from "SectorTrackers" s
              join "TrackerStatuses" ts on s.id = ts."sectorId"
              where "deviceId" = '${deviceId}'
            )`),
};

module.exports = DeviceProvider;
