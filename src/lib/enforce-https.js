/**
 * Express middleware to redirect all HTTP requests to HTTPS.
 * @private
 * @param {String} host - Hostname to use in redirection.
 * @returns {Function} Express middleware function.
 */
module.exports = host => (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${host}${req.url}`);
  }

  next();
};
