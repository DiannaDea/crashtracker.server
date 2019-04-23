const DeviceProvider = require('../providers/DeviceProvider');
const UserProvider = require('../providers/UserProvider');
const errors = require('../consts/customErrors');
const { deviceStatuses } = require('../consts/enums');

const UserController = {
  getUser: async (ctx) => {
    const { email } = ctx.params;

    const user = await UserProvider.checkIfExistsByEmail(email);

    return (user)
      ? ctx.send(200, user)
      : ctx.send(500, 'Unable to create user');
  },
  getAllDevices: async (ctx) => {
    const { id } = ctx.params;

    const user = await UserProvider.checkIfExists(id);
    if (!user) throw new errors.ClientError(`No user with such id: ${id}`);

    const devices = await DeviceProvider.findAllByParams({ userId: id });
    if (!devices) throw new errors.ClientError(`No devices for user with id: ${id}`);
    if (!devices.length) return ctx.send(200, devices);

    const deviceWithStatuses = devices.map(device => ({
      ...device.dataValues,
      status: {
        code: device.status,
        name: deviceStatuses[device.status],
      },
    }));

    return ctx.send(200, deviceWithStatuses);
  },
};

module.exports = UserController;
