const { sequelize } = require('../models');

const StatProvider = {
  getServiceStat: deviceId => sequelize
    .query(`select d.name, d.model, d."serviceInterval", s.* 
            from "Services" s
            join "Devices" d on d.id = s."deviceId"
            where s."deviceId" = '${deviceId}'`),
  getSectorsStat: deviceId => sequelize
    .query(`select st.id, st.uuid, st.name, st."maxTemperature" as "maxAccessTemp", 
            st."minTemperature" as "minAccessTemp", st."trackerSetupDate",
            s."currentTemp", s."criticalCount", s."avgTemperature", s."maxTemperature", 
            s."minTemperature", s."timeExcess" as "lastTimeExcess"
            from "SectorTrackers" st
            join "TrackerStatuses" s on s."sectorId" = st.id
            where st."deviceId" = '${deviceId}'`),
};

module.exports = StatProvider;
