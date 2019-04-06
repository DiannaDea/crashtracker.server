module.exports = (sequelize, DataTypes) => {
  const TrackerStatus = sequelize.define('TrackerStatus', {
    currentTemp: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    timeExcess: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    criticalCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    avgTemperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
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
  TrackerStatus.associate = (models) => {
    models.TrackerStatus.belongsTo(models.SectorTracker, {
      foreignKey: 'sectorId',
    });
  };
  return TrackerStatus;
};
