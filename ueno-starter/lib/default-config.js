/**
 * Default configuration values. These are deeply merged with any user-supplied values from
 * `app-config.js`.
 * @typedef {Object} UenoConfig
 */
module.exports = {
  serverRuntimeConfig: {
    passwordProtect: process.env.PASSWORD_PROTECT,
    projectId: 'ueno',
  },
  publicRuntimeConfig: {
    host: 'localhost',
    port: 3000,
    herokuDevtools: false,
    enforceHttps: false,
    gaId: '',
    facebookPixel: '',
    twitterPixel: '',
    csp: {},
    serviceWorker: true,
    polyfillIO: {
      enabled: true,
      url: '//cdn.polyfill.io/v2/polyfill.min.js',
      features: [
        'default',
        'es6',
      ],
    },
    notifier: 'warn',
    helmet: {
      htmlAttributes: {
        lang: 'en',
      },
    },
  },
};
