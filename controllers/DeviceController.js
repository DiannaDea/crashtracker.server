const DeviceProvider = require('../providers/DeviceProvider');
const UserProvider = require('../providers/UserProvider');
const SectorProvider = require('../providers/SectorProvider');
const TrackerStatusProvider = require('../providers/TrackerStatusProvider');
const errors = require('../consts/customErrors.js');
const { deviceStatuses, sectorStatuses } = require('../consts/enums');

const DeviceController = {
  create: async (ctx) => {
    const { userId, ...deviceParams } = ctx.request.body;

    const user = await UserProvider.checkIfExists(userId);
    if (!user) throw new errors.ClientError(`No user with such id: ${userId}`);

    const device = await DeviceProvider.create({ userId, ...deviceParams });
    if (!device) throw new errors.ServerError('Unable to create device');

    return ctx.send(200, device);
  },
  getOne: async (ctx) => {
    const { id } = ctx.params;

    const device = await DeviceProvider.checkIfExists(id);
    if (!device) throw new errors.ClientError(`No device with such id: ${id}`);

    return ctx.send(200, device);
  },
  getAllSectors: async (ctx) => {
    const { id } = ctx.params;

    const device = await DeviceProvider.checkIfExists(id);
    if (!device) throw new errors.ClientError(`No device with such id: ${id}`);

    const sectors = await SectorProvider.findAllByParams({ deviceId: id });
    if (!sectors || !sectors.length) throw new errors.ClientError(`No sectors for device with id: ${id}`);

    return ctx.send(200, sectors);
  },
  setCriticalSituation: async (ctx) => {
    const { id } = ctx.params;
    const { sectorId, timeExcess } = ctx.request.body;

    const device = await DeviceProvider.checkIfExists(id);
    if (!device) throw new errors.ClientError(`No device with such id: ${id}`);

    const updDevice = await DeviceProvider.update(id, {
      status: Object
        .keys(deviceStatuses)
        .find(key => deviceStatuses[key] === 'CRITICAL_SITUATION'),
    });

    const sector = await SectorProvider.checkIfExists(sectorId);
    if (!sector) throw new errors.ClientError(`No sector with such id: ${sectorId}`);

    const updSector = await SectorProvider.update(sectorId, {
      status: Object
        .keys(sectorStatuses)
        .find(key => sectorStatuses[key] === 'CRITICAL_SITUATION'),
    });

    const updTrackerStatus = await TrackerStatusProvider.update(sectorId, { timeExcess });

    if (!updDevice || !updSector || !updTrackerStatus) throw new errors.ServerError(`Unable to set critical for deviceId: ${id}, sectorId: ${sectorId}`);

    ctx.send(200);
  },
};

module.exports = DeviceController;
