require('dotenv').config();

const express = require('express');
const next = require('next');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // Accept JSON
    server.use(express.json());

    // Flash messages
    server.use(flash());

    // Express Session
    server.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false
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

    // nextjs handles the rest
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
