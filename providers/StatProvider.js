const { sequelize } = require('../models');

const StatProvider = {
  getServiceStat: deviceId => sequelize
    .query(`select d.name, d.model, d."serviceInterval", s.* 
            from "Services" s
            join "Devices" d on d.id = s."deviceId"
            where s."deviceId" = '${deviceId}'`),
};

module.exports = StatProvider;
