const basicAuth = require('basic-auth');

/**
 * Figure out the desired username/password combo for basic auth based on the input string.
 *   - A string with a colon will be parsed as `[username]:[password]`
 *   - A string with no colon will be parsed as `[password]`, with no username.
 * @private
 * @param {String} str - Input string.
 * @returns {Credentials} Credential config.
 */
const split = (str) => {
  if (str.includes(':')) {
    const [name, pass] = str.split(':');

    return { name, pass };
  }

  /**
   * Credential config.
   * @typedef {Object} Credentials
   * @prop {String} name - Username.
   * @prop {String} pass - Password.
   */
  return { name: '', pass: str };
};

/**
 * Express middleware to secure all requests with a basic username/password prompt. This is enabled
 * by adding a `PASSWORD_PROTECT` variable to `.env`.
 * @private
 */
module.exports = config => (req, res, next) => {
  const credentials = basicAuth(req);
  const { name, pass } = split(config);

  if (!credentials || credentials.name !== name || credentials.pass !== pass) {
    res.writeHead(401, {
      'WWW-Authenticate': `Basic realm="${config.projectId}"`,
    });

    return res.end();
  }

  next();
};
