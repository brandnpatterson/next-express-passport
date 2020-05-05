const router = require('express').Router();
const { User } = require('../models');

// Read User by ID
router.get('/:id', async (req, res) => {
  if (!req.user) {
    return res.json({ message: 'Please log in' });
  }

  res.json({
    id: req.user.id,
    email: req.user.email
  });
});

// Update User by ID
router.patch('/:id/update', async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  try {
    await User.update({ email }, { where: { id } });

    res.json({ id });
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

// Delete User by ID
router.delete('/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.destroy({ where: { id } });

    if (!user) {
      return res.json({ message: 'No User exists with this id' });
    }

    res.json({ message: 'User has been deleted' });
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
