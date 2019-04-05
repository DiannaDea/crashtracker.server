module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('TrackerStatuses', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    sectorId: {
      type: Sequelize.UUID,
      references: {
        model: 'SectorTrackers',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    currentTemp: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    timeExcess: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    criticalCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    avgTemperature: {
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
  down: queryInterface => queryInterface.dropTable('TrackerStatuses'),
};
