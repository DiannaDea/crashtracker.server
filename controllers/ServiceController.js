const ServiceProvider = require('../providers/ServiceProvider');
const SectorProvider = require('../providers/SectorProvider');
const DeviceProvider = require('../providers/DeviceProvider');
const DeviceStatusProvider = require('../providers/DeviceStatusProvider');
const TrackerStatusProvider = require('../providers/TrackerStatusProvider');

const errors = require('../consts/customErrors.js');
const { deviceStatuses } = require('../consts/enums');

const ServiceController = {
  startService: async (ctx) => {
    const { deviceId } = ctx.params;

    const device = await DeviceProvider.checkIfExists(deviceId);
    if (!device) throw new errors.ClientError(`No device with such id ${deviceId}`);

    try {
      await DeviceProvider.update(deviceId, {
        status: Object
          .keys(deviceStatuses)
          .find(key => (deviceStatuses[key] === 'SERVICE_IN_PROGRESS')),
      });
      // FIXME: send updated device
      return ctx.send(200);
    } catch (error) {
      throw new errors.ServerError('Error in starting service for device', error);
    }
  },
  getWorkHoursAfterService: async (deviceId) => {
    const { hours, minutes } = await DeviceStatusProvider.checkIfExists(deviceId);
    return (minutes > 0)
      ? hours + 1
      : hours;
  },
  getWorkHoursGeneral: async (deviceId) => {
    const prevServices = await ServiceProvider.getDevicePrevServices(deviceId);
    if (!prevServices || !prevServices.length) return 0;

    // eslint-disable-next-line prefer-spread
    const maxId = Math.max.apply(Math, prevServices.map(service => service.id));

    const service = prevServices.find((prevService => prevService.id === maxId));

    return service.workHoursGeneral;
  },
  getTrackerStatuses: async (deviceId) => {
    const sectors = await SectorProvider.findAllByParams({ deviceId });

    return Promise
      .all(sectors
        .map(async ({ id }) => TrackerStatusProvider.checkIfExists(id)));
  },
  getCriticalSituationsCount: async (deviceId) => {
    const trackerStatuses = await ServiceController.getTrackerStatuses(deviceId);

    const criticalCount = trackerStatuses
      .reduce((prevCount, curStatus) => prevCount + curStatus.criticalCount, 0);

    return criticalCount;
  },
  stopService: async (ctx) => {
    const { deviceId } = ctx.params;

    const device = await DeviceProvider.checkIfExists(deviceId);
    if (!device) throw new errors.ClientError(`No device with such id ${deviceId}`);

    try {
      await DeviceProvider.update(deviceId, {
        status: Object
          .keys(deviceStatuses)
          .find(key => (deviceStatuses[key] === 'SERVICE_OK')),
      });
      // FIXME: get max hours by device sectors
      const workHoursAfterService = await ServiceController.getWorkHoursAfterService(deviceId);
      const workHoursGeneral = await ServiceController.getWorkHoursGeneral(deviceId) + workHoursAfterService;
      const criticalCount = await ServiceController.getCriticalSituationsCount(deviceId);
      // const sectorsAvgTemperatures = {};

      const service = await ServiceProvider.create(deviceId, {
        workHoursAfterService,
        workHoursGeneral,
        criticalCount,
        sectorsAvgTemp: 0,
      });

      return ctx.send(200, service);
    } catch (error) {
      console.log('=====', error);
      throw new errors.ServerError('Error in stoping service for device', error);
    }
  },
};

module.exports = ServiceController;