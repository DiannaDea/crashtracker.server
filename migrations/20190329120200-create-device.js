const { deviceTypes, deviceStatuses } = require('../consts/enums');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Devices', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
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
    userId: {
      type: Sequelize.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      default: Sequelize.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      default: Sequelize.NOW,
    },
  }),
  down: queryInterface => queryInterface.dropTable('Devices'),
};
