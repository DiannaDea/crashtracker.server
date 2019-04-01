const deviceRouter = require('./device');
const sectorTrackerRouter = require('./sectorTracker');
const userRouter = require('../routes/user');

module.exports = {
  routes: [
    deviceRouter.middleware(),
    sectorTrackerRouter.middleware(),
    userRouter.middleware(),
  ],
};
