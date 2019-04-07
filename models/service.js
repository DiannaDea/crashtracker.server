module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define('Service', {
    dateStart: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    dateEnd: {
      type: DataTypes.DATEONLY,
    },
    workHoursAfterService: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    workHoursGeneral: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    criticalCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sectorsAvgTemp: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
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
