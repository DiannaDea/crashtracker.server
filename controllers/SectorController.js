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

            return sectorInfo;
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
    const sectors = await SectorProvider.findAllByParams();
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
  setCriticalSituation: async (ctx) => {
    const { uuid } = ctx.params;
    const { timeExcess } = ctx.request.body;

    const sector = await SectorProvider.checkIfExists({ uuid });
    if (!sector) throw new errors.ClientError(`No sector with such uuid: ${uuid}`);

    const { id, deviceId } = sector;

    const updSector = await SectorProvider.update(id, {
      status: Object
        .keys(sectorStatuses)
        .find(key => sectorStatuses[key] === 'CRITICAL_SITUATION'),
    });

    const device = await DeviceProvider.checkIfExists(deviceId);
    if (!device) throw new errors.ClientError(`No device with such id: ${deviceId}`);

    const updDevice = await DeviceProvider.update(deviceId, {
      status: Object
        .keys(deviceStatuses)
        .find(key => deviceStatuses[key] === 'CRITICAL_SITUATION'),
    });

    const updTrackerStatus = await TrackerStatusProvider.update(id, { timeExcess });

    if (!updDevice || !updSector || !updTrackerStatus) throw new errors.ServerError(`Unable to set critical for deviceId: ${deviceId}, sectorId: ${id}`);

    return ctx.send(200);
  },
  updateCurrentTemperatures: async (ctx) => {
    const { sectorTemperatures } = ctx.request.body;

    try {
      await Promise.all(sectorTemperatures.map(async ({ uuid, currentTemp }) => {
        const sector = await SectorProvider.checkIfExists({ uuid });
        if (sector) {
          await TrackerStatusProvider.update(sector.id, {
            currentTemp,
            ...(currentTemp < sector.maxTemperature) && { timeExcess: 0 },
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
    const { hours, minutes } = ctx.request.body;

    const sector = await SectorProvider.checkIfExists({ uuid });
    if (!sector) throw new errors.ClientError(`No sector with such uuid: ${uuid}`);

    const device = await DeviceProvider.checkIfExists(sector.deviceId);
    if (!device) throw new errors.ClientError(`No device with such id: ${sector.deviceId}`);
    const { serviceInterval } = device;

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
};

module.exports = SectorController;
