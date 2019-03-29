module.exports = (sequelize, DataTypes) => {
  const SectorTracker = sequelize.define('Sector', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // for iot server
    uuid: DataTypes.STRING,
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
    trackerSetupDate: DataTypes.DATEONLY,
    // in minutes
    maxTimeExcess: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});

  SectorTracker.associate = (models) => {
    models.Sector.belongsTo(models.Device, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return SectorTracker;
};
