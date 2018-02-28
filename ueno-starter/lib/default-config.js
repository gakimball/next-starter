/**
 * Default configuration values. These are deeply merged with any user-supplied values from
 * `app-config.js`.
 * @typedef {Object} UenoConfig
 */
module.exports = {
  serverRuntimeConfig: {
    helmet: {
      htmlAttributes: {
        lang: 'en',
      },
      title: 'Home',
      titleTemplate: 'Ueno - %s',
      meta: [
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      ],
    },
    passwordProtect: process.env.PASSWORD_PROTECT,
    polyfillIO: {
      url: '//cdn.polyfill.io/v2/polyfill.min.js',
      features: [
        'default',
        'es6',
      ],
    },
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
    notifier: 'warn',
  },
};
