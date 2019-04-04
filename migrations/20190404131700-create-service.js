module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Services', {
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
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    workHoursAfterService: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    workHoursGeneral: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    criticalCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sectorsAvgTemp: {
      type: Sequelize.FLOAT,
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
  down: queryInterface => queryInterface.dropTable('Services'),
};
