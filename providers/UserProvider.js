const { User } = require('../models');

const UserProvider = {
  checkIfExists: async userId => User.findOne({ where: { id: userId } }),
};

module.exports = UserProvider;