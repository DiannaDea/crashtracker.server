const pick = require('lodash.pick');

const DeviceProvider = require('../providers/DeviceProvider');
const SectorProvider = require('../providers/SectorProvider');
const DeviceStatusProvider = require('../providers/DeviceStatusProvider');
const TrackerStatusProvider = require('../providers/TrackerStatusProvider');
const errors = require('../consts/customErrors.js');
const { deviceStatuses, sectorStatuses } = require('../consts/enums');

const SectorController = {
  create: async (ctx) => {
    const { deviceId, sectorTrackers } = ctx.request.body;

    const device = await DeviceProvider.checkIfExists(deviceId);
    if (!device) throw new errors.ClientError(`No device with such id ${deviceId}`);

    try {
      const sectors = await Promise
        .all(sectorTrackers
          .map(async (sector) => {
            const sectorInfo = await SectorProvider.create({ deviceId, ...sector });
            await TrackerStatusProvider.create(sectorInfo.id);

            return {
              ...sectorInfo.dataValues,
              status: {
                currentTemp: 0,
                name: 'OK',
                number: 1,
                timeExcess: 0,
              },
            };
          }));

      return ctx.send(200, sectors);
    } catch (error) {
      throw new errors.ServerError(error.message);
    }
  },
  getOne: async (ctx) => {
    const { id } = ctx.params;

    const sector = await SectorProvider.getOneFullInfo({ id });
    if (!sector) throw new errors.ClientError(`No sector with such id: ${id}`);

    return ctx.send(200, sector);
  },
  getWorkDetails: async (ctx) => {
    const sectors = await SectorProvider.findAll();
    if (!sectors || !sectors.length) throw new errors.ClientError('No sectors');

    const workDetails = await Promise.all(sectors.map(async (sector) => {
      const device = await DeviceProvider.checkIfExists(sector.deviceId);
      if (!device) throw new errors.ClientError(`No device with such id: ${sector.deviceId}`);

      const { serviceInterval, notifyBeforeService } = device;

      const notificationHours = Math.floor(serviceInterval / 100 * notifyBeforeService);

      return {
        ...pick(sector, ['uuid', 'maxTemperature', 'minTemperature', 'maxTimeExcess']),
        notificationHours,
      };
    }));
    return ctx.send(200, workDetails);
  },
  getAll: async (ctx) => {
    const sectors = await SectorProvider.findAllByParams();
    if (!sectors || !sectors.length) throw new errors.ClientError('No sectors');

    return ctx.send(200, sectors);
  },
  setSectorCriticalStatus: async (sectorId, sectorStatus) => {
    if (sectorStatus !== 'CRITICAL_SITUATION') {
      await SectorProvider.update(sectorId, {
        status: Object
          .keys(sectorStatuses)
          .find(key => sectorStatuses[key] === 'CRITICAL_SITUATION'),
      });
    }
  },
  setDeviceCriticalStatus: async (deviceId) => {
    const device = await DeviceProvider.checkIfExists(deviceId);
    if (!device) throw new errors.ClientError(`No device with such id: ${deviceId}`);

    const curDeviceStatus = deviceStatuses[device.status];

    if (curDeviceStatus !== 'CRITICAL_SITUATION') {
      return DeviceProvider.update(deviceId, {
        status: Object
          .keys(deviceStatuses)
          .find(key => deviceStatuses[key] === 'CRITICAL_SITUATION'),
      });
    }

    return device;
  },
  increaseCriticalCount: async (sectorId, timeExcess, sectorStatus) => {
    const trackerStatus = await TrackerStatusProvider.checkIfExists(sectorId);
    if (!trackerStatus) throw new errors.ClientError(`No trackerStatus with such id: ${trackerStatus.id}`);

    const { criticalCount } = trackerStatus;

    return TrackerStatusProvider.update(sectorId, {
      timeExcess,
      criticalCount: (sectorStatus !== 'CRITICAL_SITUATION')
        ? criticalCount + 1
        : criticalCount,
    });
  },
  setCriticalSituation: async (ctx) => {
    const { uuid } = ctx.params;
    const { timeExcess } = ctx.request.body;

    const sector = await SectorProvider.checkIfExists({ uuid });
    if (!sector) throw new errors.ClientError(`No sector with such uuid: ${uuid}`);

    const curSectorStatus = sectorStatuses[sector.status];

    try {
      await SectorController.increaseCriticalCount(sector.id, timeExcess, curSectorStatus);

      await SectorController.setSectorCriticalStatus(sector.id, curSectorStatus);
      await SectorController.setDeviceCriticalStatus(sector.deviceId);

      return ctx.send(200);
    } catch (error) {
      throw new errors.ServerError(`Unable to set critical for sector uuid: ${uuid}`);
    }
  },
  updateCurrentTemperatures: async (ctx) => {
    const { sectorTemperatures } = ctx.request.body;

    try {
      await Promise.all(sectorTemperatures.map(async ({ uuid, currentTemp, minutesWork }) => {
        const sector = await SectorProvider.checkIfExists({ uuid });
        const trackerStatus = await TrackerStatusProvider.checkIfExists(sector.id);

        const workTime = (trackerStatus.minutes + minutesWork >= 60)
          ? {
            hours: trackerStatus.hours + 1,
            minutes: trackerStatus.minutes + minutesWork - 60,
          }
          : {
            hours: trackerStatus.hours,
            minutes: trackerStatus.minutes + minutesWork,
          };

        if (sector && trackerStatus) {
          await TrackerStatusProvider.update(sector.id, {
            currentTemp,
            avgTemperature: (currentTemp + trackerStatus.avgTemperature) / 2,
            maxTemperature: Math.max(trackerStatus.maxTemperature, currentTemp),
            minTemperature: Math.min(trackerStatus.maxTemperature, currentTemp),
            ...(currentTemp < sector.maxTemperature) && { timeExcess: 0 },
            ...workTime,
          });
        }
      }));
      return ctx.send(200);
    } catch (error) {
      throw new errors.ServerError('Error in updating temperatures', error);
    }
  },
  changeToService: async (ctx) => {
    const { uuid } = ctx.params;

    const sector = await SectorProvider.checkIfExists({ uuid });
    if (!sector) throw new errors.ClientError(`No sector with such uuid: ${uuid}`);

    const device = await DeviceProvider.checkIfExists(sector.deviceId);
    if (!device) throw new errors.ClientError(`No device with such id: ${sector.deviceId}`);
    const { serviceInterval } = device;

    const [{ hours, minutes }] = (await DeviceProvider.getMaxWorkHoursBySector(device.id))[0];

    try {
      const status = (hours > serviceInterval)
        ? 'SERVICE_OVERDUE'
        : 'SERVICE_SOON';

      await DeviceProvider.update(device.id, {
        status: Object
          .keys(deviceStatuses)
          .find(key => (deviceStatuses[key] === status)),
      });

      await DeviceStatusProvider.update(device.id, { hours, minutes });
      return ctx.send(200);
    } catch (error) {
      throw new errors.ServerError('Error in setting service for device', error);
    }
  },
  deleteSector: async (ctx) => {
    const { id } = ctx.params;

    const sector = await SectorProvider.checkIfExists({ id });
    if (!sector) throw new errors.ClientError(`No sector with such id: ${id}`);

    const trackerStatus = await TrackerStatusProvider.checkIfExists(sector.id);

    try {
      if (trackerStatus) {
        await trackerStatus.destroy({ force: true });
      }

      await sector.destroy({ force: true });
      return ctx.send(200, { success: true });
    } catch (error) {
      throw new errors.ServerError(error.message);
    }
  },
};

module.exports = SectorController;
