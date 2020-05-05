const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v1: uuidv1 } = require('uuid');
const transporter = require('../config/nodemailer');
const { User, ResetRequest } = require('../models');

// Confirm Email
router.get('/confirm/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const { id } = jwt.verify(token, process.env.SESSION_SECRET);

    User.update({ confirmed: true }, { where: { id } });

    res.json({ message: 'Thank you for confirming your email' });
  } catch (err) {
    res.json({ message: 'Invalid token. Please try again' });
  }

  res.redirect('/api/auth/login');
});

// Forgot Password
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const token = uuidv1();
  const message = 'Click here to reset your password:';
  const url = `http://localhost:3000/reset/${token}`;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ message: 'No User exists with this email' });
    }

    ResetRequest.create({ email, token });

    const msg = {
      to: email,
      subject: 'Forgot your password',
      text: `${message} ${url}`,
      html: `${message} <a href="${url}">${url}</a>`
    };

    transporter.sendMail(msg);

    res.status(200).json({
      message:
        'If an account exists with this email, an email has been sent to reset your password'
    });
  } catch (err) {
    res.json({ message: err });
    res.status(500).send('Internal Server Error');
  }
});

// Reset Password
router.post('/reset', async (req, res) => {
  const { password, passwordConfirm, token } = req.body;

  if (!password || !passwordConfirm) {
    res.json({ message: 'All fields are required' });
  }

  try {
    const resetRequest = await ResetRequest.findOne({ where: { token } });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (!resetRequest) {
      return res.status(403);
    }

    User.update(
      { password: hashedPassword },
      { where: { email: resetRequest.email } }
    );

    ResetRequest.destroy({
      where: { id: resetRequest.id }
    });

    res.json({ message: 'You have reset your password' });
  } catch (err) {
    console.log(err);

    res.status(403);
  }
});

module.exports = router;
