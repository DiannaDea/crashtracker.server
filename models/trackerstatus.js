module.exports = (sequelize, DataTypes) => {
  const TrackerStatus = sequelize.define('TrackerStatus', {
    currentTemp: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timeExcess: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  TrackerStatus.associate = (models) => {
    models.TrackerStatus.belongsTo(models.SectorTracker, {
      foreignKey: 'sectorId',
    });
  };
  return TrackerStatus;
};
