const deviceRouter = require('./device');
const sectorTrackerRouter = require('./sectorTracker');

module.exports = {
  routes: [
    deviceRouter.middleware(),
    sectorTrackerRouter.middleware(),
  ],
};
