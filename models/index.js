const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const sequelize = require('../services/postgresConnection.js');

const basename = path.basename(__filename);
const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = {
  ...db,
  sequelize,
  Sequelize,
};
