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
      const updDevice = await DeviceProvider.update(deviceId, {
        status: Object
          .keys(deviceStatuses)
          .find(key => (deviceStatuses[key] === 'SERVICE_IN_PROGRESS')),
      });

      return ctx.send(200, updDevice);
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

    const hoursBefore = prevServices
      .reduce((prevHoursSum, curService) => prevHoursSum + curService.hours, 0);

    const minutesBefore = prevServices
      .reduce((prevMinutesSum, curService) => prevMinutesSum + curService.hours, 0);

    return hoursBefore + minutesBefore / 60;
  },
  getTrackerStatuses: async (deviceId) => {
    const sectors = await SectorProvider.findAllByParams({ deviceId });
    return Promise.all(sectors.map(({ id }) => TrackerStatusProvider.findOne({ sectorId: id })));
  },
  getCriticalSituationsCount: async (deviceId) => {
    const trackerStatuses = this.getTrackerStatuses(deviceId);
    const criticalCount = trackerStatuses
      .reduce((prevCount, curStatus) => prevCount + curStatus.criticalSituationsCount, 0);

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

      // const workHoursAfterService = this.getWorkHoursAfterService(deviceId);
      // const workHoursGeneral = this.getWorkHoursGeneral(deviceId) + workHoursAfterService;
      // const criticalSituationsCount = this.getCriticalSituationsCount(deviceId);
      // const sectorsAvgTemperatures = {};

      await ServiceProvider.create(deviceId, {
        workHoursAfterService: 0,
        workHoursGeneral: 0,
        criticalCount: 0,
        sectorsAvgTemp: 0,
      });
    } catch (error) {
      throw new errors.ServerError('Error in stoping service for device', error);
    }
  },
};

module.exports = ServiceController;
