const { deviceTypes, deviceStatuses } = require('../consts/enums');

module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: deviceTypes,
      allowNull: false,
    },
    model: DataTypes.STRING,
    description: DataTypes.STRING,
    // in hours
    serviceInterval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    dateLastService: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    // percent of serviceInterval
    notifyBeforeService: {
      type: DataTypes.FLOAT,
      defaultValue: 15,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: parseInt(Object.keys(deviceStatuses).sort((a, b) => a - b)[0], 10),
        max: parseInt(Object.keys(deviceStatuses).sort((a, b) => b - a)[0], 10),
      },
    },
  }, {});

  Device.associate = (models) => {
    models.Device.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
    });
    models.Device.hasMany(models.SectorTracker, {
      foreignKey: 'deviceId',
      sourceKey: 'id',
    });
    models.Device.hasMany(models.Service, {
      foreignKey: 'deviceId',
      sourceKey: 'id',
    });
  };

  return Device;
};
