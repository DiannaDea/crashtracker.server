const { sectorStatuses } = require('../consts/enums');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('SectorTrackers', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: parseInt(Object.keys(sectorStatuses).sort((a, b) => a - b)[0], 10),
        max: parseInt(Object.keys(sectorStatuses).sort((a, b) => b - a)[0], 10),
      },
    },
    uuid: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    location: Sequelize.STRING,
    maxTemperature: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    minTemperature: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    trackerSetupDate: Sequelize.DATEONLY,
    // in minutes
    maxTimeExcess: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    deviceId: {
      type: Sequelize.UUID,
      references: {
        model: 'Devices',
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
  down: queryInterface => queryInterface.dropTable('SectorTrackers'),
};
