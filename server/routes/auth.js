const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const transporter = require('../config/nodemailer');
const signJwToken = require('../helpers/signJwToken');
const { User } = require('../models');

// Logged In User
router.get('/success', (req, res) => {
  if (!req.user) {
    return res.json({ message: 'Please log in' });
  }

  res.json({ message: req.user.email });
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/api/auth/success',
    failureRedirect: '/api/auth/messages',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/api/auth/messages');
});

// Flash Messages
router.get('/messages', (req, res) => {
  res.status(400).json(req.flash());
});

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirm } = req.body;

  let errors = [];

  if (!email || !password || !passwordConfirm) {
    errors.push({ message: 'All fields are required' });
  }

  if (password !== passwordConfirm) {
    errors.push({ message: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ message: 'Password must be at least six characters' });
  }

  if (errors.length > 0) {
    return res.status(400).json(errors);
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const result = await User.findOrCreate({
      where: {
        email
      },
      defaults: {
        email,
        password: hashedPassword
      }
    });

    const existingUser = result[0];
    const createdUser = result[1];

    if (!createdUser) {
      errors.push({ message: 'User already exists with that email' });
      return res.status(400).json(errors);
    }

    signJwToken(existingUser.id, (err, emailToken) => {
      const message = 'Please confirm your email:';
      const url = `http://localhost:3000/api/email/confirm/${emailToken}`;

      const msg = {
        to: email,
        subject: 'Confirm Email',
        text: `${message} ${url}`,
        html: `${message} <a href="${url}">${url}</a>`
      };

      transporter.sendMail(msg);
    });

    res.sendStatus(200);
  } catch (err) {
    console.log(err);

    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
