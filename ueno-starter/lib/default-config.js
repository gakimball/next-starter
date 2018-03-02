/**
 * Default configuration values. These are deeply merged with any user-supplied values from
 * `app-config.js`.
 * @typedef {Object} UenoConfig
 */
module.exports = {
  /**
   * Config values available to the server only. Store sensitive things here that shouldn't be
   * visible to the client.
   * @type Object
   */
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
    serverWorker: false,
    facebookPixel: null,
    twitterPixel: null,
  },
  /**
   * Config values available to the server and the client. Store values here that are permissable
   * to be revealed to the client.
   * @type Object
   */
  publicRuntimeConfig: {
    herokuDevtools: false,
    enforceHttps: false,
    gaId: '',
    csp: {},
    serviceWorker: true,
    notifier: 'warn',
  },
};
