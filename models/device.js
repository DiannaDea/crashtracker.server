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
    },
    model: DataTypes.STRING,
    description: DataTypes.STRING,
    // in days
    serviceInterval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      default: 30,
    },
    dateLastService: {
      type: DataTypes.DATEONLY,
      default: DataTypes.NOW,
    },
    // percent of serviceInterval
    notifyBeforeService: {
      type: DataTypes.FLOAT,
      default: 15,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: Object.keys(deviceStatuses).sort((a, b) => a - b)[0],
        max: Object.keys(deviceStatuses).sort((a, b) => b - a)[0],
      },
    },
  }, {});

  Device.associate = (models) => {
    models.Device.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
    models.Device.hasMany(models.SectorTracker);
  };

  return Device;
};
