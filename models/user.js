module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {});

  User.associate = (models) => {
    models.User.hasMany(models.Device);
  };

  return User;
};
