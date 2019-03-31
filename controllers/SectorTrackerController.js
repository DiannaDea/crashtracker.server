const SectorTrackerController = {
  create(ctx) {
    return ctx.send(200, 'Create sectors');
  },
  update(ctx) {
    return ctx.send(200, 'Update sectors');
  },
  getOne(ctx) {
    return ctx.send(200, 'Get one sectors');
  },
  getAll(ctx) {
    return ctx.send(200, 'Get all sectors');
  },
};

module.exports = SectorTrackerController;
