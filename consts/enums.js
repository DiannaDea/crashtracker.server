const deviceTypes = ['fridge', 'cooker', 'oven'];

const deviceStatuses = {
  1: 'SERVICE_OK',
  2: 'SERVICE_SOON',
  3: 'SERVICE_OVERDUE',
  4: 'CRITICAL_SITUATION',
  5: 'SERVICE_IN_PROGRESS',
};

const sectorStatuses = {
  1: 'OK',
  2: 'CRITICAL_SITUATION',
};

module.exports = {
  deviceTypes,
  deviceStatuses,
  sectorStatuses,
};
