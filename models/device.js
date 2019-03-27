module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {});

  Device.associate = (models) => {
    models.Device.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return Device;
};
