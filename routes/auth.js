const router = require('koa-joi-router');
const AuthController = require('../controllers/AuthController');

const { Joi } = router;

const authRouter = router();

authRouter.prefix('/api/auth');

authRouter.route({
  method: 'post',
  path: '/signup',
  validate: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      firstName: Joi.string().alphanum().min(1).max(30)
        .required(),
      lastName: Joi.string().alphanum().min(1).max(30)
        .required(),
    },
    type: 'json',
  },
  handler: AuthController.signUp,
});

authRouter.route({
  method: 'post',
  path: '/signin',
  validate: {
    body: {
      email: Joi.string().email(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    },
    type: 'json',
  },
  handler: AuthController.signIn,
});

module.exports = authRouter;
