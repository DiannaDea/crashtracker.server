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
    dateStart: {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    dateEnd: {
      type: Sequelize.DATEONLY,
    },
    workHoursAfterService: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    workHoursGeneral: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    criticalCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    sectorsAvgTemp: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
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
