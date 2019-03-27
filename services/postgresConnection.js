const Sequelize = require('sequelize');
const config = require('config');

const logger = require('../utils/logger');

const {
  user,
  password,
  name,
  host,
  port,
} = config['postgres-db'];

const sequelize = new Sequelize(`postgres://${user}:${password}@${host}:${port}/${name}`, {
  benchmark: true,
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    ssl: true,
  },
  pool: {
    max: 30,
    acquire: 30000,
  },
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection to PostgreSQL has been established successfully.');
  })
  .catch((err) => {
    logger.error('Unable to connect to the PostgreSQL database:', err);
  });

module.exports = sequelize;
