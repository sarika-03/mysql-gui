const base64 = require('base-64');
require('dotenv').config();

function _decodeCredentials(header) {
  try {
    const encoded = header.trim().replace(/Basic\s+/i, '');
    const decoded = base64.decode(encoded);
    const [username, password] = decoded.split(':');
    return [username, password];
  } catch (err) {
    return [];
  }
}

function authentication(req, res, next) {
  const [username, password] = _decodeCredentials(req.headers.authorization || '');

  // If either username or password environment variable is missing, skip auth
  if (!process.env.MYSQLGUI_USERNAME || !process.env.MYSQLGUI_PASSWORD) {
    return next();
  }

  // Perform authentication check
  if (
    username === process.env.MYSQLGUI_USERNAME &&
    password === process.env.MYSQLGUI_PASSWORD
  ) {
    return next();
  }

  // Authentication failed
  res.set('WWW-Authenticate', 'Basic realm="user_pages"');
  res.status(401).send('Authentication required!');
}

module.exports = {
  authentication
};
