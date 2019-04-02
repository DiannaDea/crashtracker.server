const { User } = require('../models');

const UserProvider = {
  checkIfExists: userId => User.findOne({ where: { id: userId } }),
};

module.exports = UserProvider;
