const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('config');
const pick = require('lodash.pick');

const UserProvider = require('../providers/UserProvider');
const errors = require('../consts/customErrors.js');

const AuthController = {
  signUp: async (ctx) => {
    const {
      email,
      password,
      firstName,
      lastName,
    } = ctx.request.body;

    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      if (await UserProvider.checkIfExistsByEmail(email)) {
        throw new errors.ClientError('User with such email already exists');
      }

      const user = await UserProvider.create({
        email,
        firstName,
        lastName,
        password: hash,
      });

      if (!user) throw new errors.ServerError('Unable to create user');

      return ctx.send(200, user);
    } catch (error) {
      throw new errors.ServerError(error.message);
    }
  },
  signIn: async (ctx) => {
    try {
      return passport.authenticate('local', { session: false }, async (err, user) => {
        if (err || !user) {
          return ctx.send(400, 'Incorrect credentials');
        }

        await ctx.login(user, { session: false });

        const token = jwt.sign(
          pick(user, ['id', 'email', 'firstname']),
          config.token.secret, {
            expiresIn: config.token.expiresIn,
          },
        );

        return ctx.send(200, { token });
      })(ctx);
    } catch (error) {
      return ctx.send(500, error);
    }
  },
};

module.exports = AuthController;
