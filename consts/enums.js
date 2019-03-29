const deviceTypes = ['fridge', 'cooker', 'oven'];

const deviceStatuses = {
  1: 'SERVICE_OK',
  2: 'SERVICE_SOON',
  3: 'SERVICE_OVERDUE',
  4: 'CRITICAL_SITUATION',
  5: 'SERVICE_IN_PROGRESS',
};

module.exports = {
  deviceTypes,
  deviceStatuses,
};
