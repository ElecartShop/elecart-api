const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if(!token || token ==='') {
    req.authorized = false;
    return next();
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'moveSecretToENV');
  } catch(err) {
    req.authorized = false;
    return next();
  };

  req.authorized = true;
  req.user_id = decodedToken.user_id;

  next();
}
