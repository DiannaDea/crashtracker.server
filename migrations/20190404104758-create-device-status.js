module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('DeviceStatuses', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    deviceId: {
      type: Sequelize.UUID,
      references: {
        model: 'Devices',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    hours: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    minutes: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('DeviceStatuses'),
};
