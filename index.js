require('dotenv').config();

const express = require('express');
const next = require('next');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { sequelize } = require('./server/models');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // Process Document Body
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));

    // Flash messages
    server.use(flash());

    function extendDefaultFields(defaults, session) {
      return {
        data: defaults.data,
        expires: defaults.expires,
        userId: session.userId
      };
    }

    // Express Session
    server.use(
      session({
        secret: process.env.SESSION_SECRET,
        store: new SequelizeStore({
          db: sequelize,
          checkExpirationInterval: 15 * 60 * 1000,
          expiration: 24 * 60 * 60 * 1000,
          table: 'Session',
          extendDefaultFields
        }),
        cookie: {
          maxAge: 24 * 60 * 60 * 1000
        },
        resave: false,
        saveUninitialized: true
      })
    );

    // Passport Config
    require('./server/config/passport')(passport);

    // Passport
    server.use(passport.initialize());
    server.use(passport.session());

    // API Routes
    server.use('/api/auth', require('./server/routes/auth'));
    server.use('/api/email', require('./server/routes/email'));
    server.use('/api/users', require('./server/routes/users'));

    // Frontend Routes
    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, () => {
      console.log(`Node is listening at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
