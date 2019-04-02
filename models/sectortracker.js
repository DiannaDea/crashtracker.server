const { sectorStatuses } = require('../consts/enums');

module.exports = (sequelize, DataTypes) => {
  const SectorTracker = sequelize.define('SectorTracker', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: parseInt(Object.keys(sectorStatuses).sort((a, b) => a - b)[0], 10),
        max: parseInt(Object.keys(sectorStatuses).sort((a, b) => b - a)[0], 10),
      },
    },
    // for iot server
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: DataTypes.STRING,
    maxTemperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    minTemperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    trackerSetupDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    // in minutes
    maxTimeExcess: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});

  SectorTracker.associate = (models) => {
    models.SectorTracker.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      targetKey: 'id',
    });
  };

  return SectorTracker;
};
