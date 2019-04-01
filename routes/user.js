const router = require('koa-joi-router');
const UserController = require('../controllers/UserController');

const userRouter = router();

const { Joi } = router;

userRouter.prefix('/api/users');

userRouter.route({
  method: 'get',
  path: '/:id/devices',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  handler: UserController.getAllDevices,
});

module.exports = userRouter;
