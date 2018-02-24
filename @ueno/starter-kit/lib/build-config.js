/* eslint-disable import/no-dynamic-require */
/* global __non_webpack_require__ */

const path = require('path');
const deepAssign = require('deep-assign');

/**
 * Default configuration values. These are deeply merged with any user-supplied values from
 * `app-config.js`.
 * @typedef {Object} UenoConfig
 */
const defaultConfig = {
  /**
   * Hostname to access server.
   * @type String
   */
  host: 'localhost',
  /**
   * Port to access server.
   * @type Number
   */
  port: 3000,
  /**
   * Enable devtools when on Heroku.
   * @type Boolean
   */
  herokuDevtools: false,
  /**
   * Redirect from HTTP to HTTPS.
   * @type Boolean
   */
  enforceHttps: false,
  /**
   * Google analytics ID.
   * @type String
   */
  gaId: '',
  /**
   * Facebook analytics ID.
   * @type String
   */
  facebookPixel: '',
  /**
   * Twitter analytics ID.
   * @type String
   */
  twitterPixel: '',
  /**
   * Overrides to the default Content Security Policy.
   * @type Object
   * @see {@link https://helmetjs.github.io/docs/csp/|Helmet CSP Documentation}
   */
  csp: {},
  /**
   * Enable sevice workers.
   * @type Boolean
   */
  serviceWorker: true,
  /**
   * Settings for polyfill.io.
   * @type Object
   */
  polyfillIO: {
    /**
     * Enable polyfills.
     * @type Boolean
     */
    enabled: true,
    /**
     * URL to fetch polyfills from.
     * @type String
     */
    url: '//cdn.polyfill.io/v2/polyfill.min.js',
    /**
     * Features to polyfill.
     * @type String[]
     * @see {@link https://polyfill.io/v2/docs/features/|Polyfill.io Features Documentation}
     */
    features: [
      'default',
      'es6',
    ],
  },
  /**
   * Enable OS-level notifications for events. Can be `warn`, `error`, `special`, or `info`.
   * @type String
   */
  notifier: 'warn',
};

/**
 * Generate a final configuration object by combining the defaults with user values.
 * @private
 * @returns {Object} Config object.
 */
module.exports = () => {
  let config;

  try {
    // @TODO Find a way to avoid using Webpack-specific code here
    // Webpack freaks out about this dynamic require
    config = __non_webpack_require__(path.join(process.cwd(), 'app-config.js'));
  } catch (err) {
    config = {};
  }

  return deepAssign({}, defaultConfig, config);
};
