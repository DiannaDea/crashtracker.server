module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    workHoursAfterService: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    workHoursGeneral: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    criticalCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sectorsAvgTemp: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
