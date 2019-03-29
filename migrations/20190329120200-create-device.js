const { deviceTypes, deviceStatuses } = require('../consts/enums');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Devices', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM,
      values: deviceTypes,
    },
    model: Sequelize.STRING,
    description: Sequelize.STRING,
    // in days
    serviceInterval: {
      type: Sequelize.INTEGER,
      allowNull: false,
      default: 30,
    },
    dateLastService: {
      type: Sequelize.DATEONLY,
      default: Sequelize.NOW,
    },
    // percent of serviceInterval
    notifyBeforeService: {
      type: Sequelize.FLOAT,
      default: 15,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        min: Object.keys(deviceStatuses).sort((a, b) => a - b)[0],
        max: Object.keys(deviceStatuses).sort((a, b) => b - a)[0],
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('Devices'),
};
