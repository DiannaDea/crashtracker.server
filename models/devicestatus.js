module.exports = (sequelize, DataTypes) => {
  const DeviceStatus = sequelize.define('DeviceStatus', {
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {});
  DeviceStatus.associate = (models) => {
    models.DeviceStatus.belongsTo(models.Device, {
      foreignKey: 'deviceId',
    });
  };
  return DeviceStatus;
};
