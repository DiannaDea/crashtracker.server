const DeviceProvider = require('../providers/DeviceProvider');
const SectorProvider = require('../providers/SectorProvider');
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

      ctx.send(200, sectors);
    } catch (error) {
      throw new errors.ServerError(error.message);
    }
  },
  getOne: async (ctx) => {
    const { id } = ctx.params;

    const sector = await SectorProvider.checkIfExists({ id });
    if (!sector) throw new errors.ClientError(`No sector with such id: ${id}`);

    return ctx.send(200, sector);
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

    ctx.send(200);
  },
};

module.exports = SectorController;
