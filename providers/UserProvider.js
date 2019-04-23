const uuid = require('node-uuid');
const { User } = require('../models');

const UserProvider = {
  checkIfExists: userId => User.findOne({ where: { id: userId } }),
  checkIfExistsByEmail: email => User.findOne({ where: { email } }),
  create: userParams => User.create({
    id: uuid.v4(),
    ...userParams,
  }),
};

module.exports = UserProvider;
