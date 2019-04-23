const passport = require('passport');
const passportJWT = require('passport-jwt');
const passportLocal = require('passport-local');
const bcryptjs = require('bcryptjs');
const config = require('config');

const UserProvider = require('../providers/UserProvider');

const LocalStrategy = passportLocal.Strategy;

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const localOptions = {
  usernameField: 'email',
  passwordField: 'password',
};
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.token.secret,
};

passport.use(new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    try {
      const user = await UserProvider.checkIfExistsByEmail(email);
      if (!user) {
        return done(null, false);
      }

      const samePasswords = await bcryptjs.compare(password, user.password);

      return (samePasswords)
        ? done(null, user)
        : done(null, false);
    } catch (err) {
      return done(err);
    }
  },
));

passport.use(new JWTStrategy(
  jwtOptions,
  async (jwtPayload, done) => {
    try {
      console.log('==== jwt', jwtPayload);
      const user = await UserProvider.checkIfExists(jwtPayload.id);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
));
