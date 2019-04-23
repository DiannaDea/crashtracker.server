const deviceRouter = require('./device');
const sectorTrackerRouter = require('./sectorTracker');
const userRouter = require('../routes/user');
const serviceRouter = require('../routes/service');
const statisticsRouter = require('../routes/statistics');
const authRouter = require('./auth');

module.exports = {
  routes: [
    deviceRouter.middleware(),
    sectorTrackerRouter.middleware(),
    userRouter.middleware(),
    serviceRouter.middleware(),
    statisticsRouter.middleware(),
    authRouter.middleware(),
  ],
};
