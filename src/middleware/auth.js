// TODO: Revisit Auth system and use something more secure than JWT
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
  }

  if (decodedToken.customer_id) {
    req.customer_authorized = true;
    req.customer_id = decodedToken.customer_id;
  }
  if (decodedToken.user_id) {
    req.user_authorized = true;
    req.user_id = decodedToken.user_id;
  }
  if (decodedToken.admin_id) {
    req.admin_authorized = true;
    req.admin_id = decodedToken.admin_id;
  }

  next();
};
