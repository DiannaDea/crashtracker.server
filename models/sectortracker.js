module.exports = (sequelize, DataTypes) => {
  const SectorTracker = sequelize.define('SectorTracker', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
