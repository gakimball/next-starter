const hostEnv = require('../host-env');

/**
 * Default configuration values. These are deeply merged with any user-supplied values from
 * `app-config.js`.
 * @private
 * @typedef {Object} UenoConfig
 */
module.exports = {
  /**
   * Config values available to the server only. Store sensitive things here that shouldn't be
   * visible to the client.
   * @type Object
   */
  serverRuntimeConfig: {
    // Add to default Content Security Policy
    csp: {},
    // Redirect HTTP to HTTPS
    enforceHttps: false,
    // Enable Facebook tracking
    facebookPixel: null,
    // @TODO Show OS notifications
    notifier: 'warn',
    // Enable polyfill.io (set to `null` to disable)
    polyfillIO: {
      // Script to fetch
      url: '//cdn.polyfill.io/v2/polyfill.min.js',
      // Features to polyfill
      features: [
        'default',
        'es6',
      ],
    },
    // Enable offline support via service worker
    serviceWorker: true,
    // Enable Twitter tracking
    twitterPixel: null,
  },
  /**
   * Config values available to the server and the client. Store values here that are permissable
   * to be revealed to the client.
   * @type Object
   */
  publicRuntimeConfig: {
    // Base URL for server requests
    baseUrl: process.env.BASE_URL || `http://${hostEnv.HOST}:${hostEnv.PORT}`,
    // Enable Google Analytics tracking
    gaId: null,
    // Pass Helmet attributes to HTML
    helmet: {},
    // @TODO Add dev tools
    remoteDevtools: false,
  },
};
