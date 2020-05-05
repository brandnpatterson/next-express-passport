const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { User } = require('../models');

function initialize(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ where: { email } });

          if (!user) {
            return done(null, false, {
              message: 'That email is not registered'
            });
          }

          const authenticated = await bcrypt.compare(password, user.password);

          if (authenticated) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        } catch (err) {
          return done(null, false, { message: 'An error occurred' });
        }
      }
    )
  );

  passport.serializeUser(({ id }, done) => done(null, id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({ where: { id } });

      done(null, user);
    } catch (err) {
      done(null, false);
    }
  });
}

module.exports = initialize;
