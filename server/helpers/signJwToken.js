const jwt = require('jsonwebtoken');

function signJwToken(id, callback) {
  jwt.sign(
    { id },
    process.env.SESSION_SECRET,
    {
      expiresIn: '20m'
    },
    (err, emailToken) => callback(err, emailToken)
  );
}

module.exports = signJwToken;
