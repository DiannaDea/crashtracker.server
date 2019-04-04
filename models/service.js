module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    workHoursAfterService: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workHoursGeneral: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    criticalSituationsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sectorsAvgTemperatures: {
      type: DataTypes.INTEGER,
      allowNull: JSON,
    },
  }, {});

  Service.associate = (models) => {
    models.Service.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      targetKey: 'id',
    });
  };
  return Service;
};
