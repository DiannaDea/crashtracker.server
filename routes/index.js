const deviceRouter = require('./device');
const sectorTrackerRouter = require('./sectorTracker');
const userRouter = require('../routes/user');
const serviceRouter = require('../routes/service');

module.exports = {
  routes: [
    deviceRouter.middleware(),
    sectorTrackerRouter.middleware(),
    userRouter.middleware(),
    serviceRouter.middleware(),
  ],
};
