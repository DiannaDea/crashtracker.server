module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('SectorTrackers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // for iot server
    uuid: Sequelize.STRING,
    number: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    location: Sequelize.STRING,
    maxTemperature: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    minTemperature: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    trackerSetupDate: Sequelize.DATEONLY,
    // in minutes
    maxTimeExcess: {
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
  down: queryInterface => queryInterface.dropTable('SectorTrackers'),
};
