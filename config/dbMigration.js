const config = require('config');

const {
  user,
  password,
  name,
  host,
  port,
} = config['postgres-db'];

module.exports = {
  development: {
    username: user,
    password,
    database: name,
    host,
    port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: true,
    },
  },
};
