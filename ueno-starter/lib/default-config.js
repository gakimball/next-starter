const toBoolean = (val) => {
  if (val === 'true' || val === '1') return true;
  if (val === 'false') return false;
  return true;
};

const defaultBaseUrl = () => {
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 3000;

  return `http://${host}:${port}`;
};

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
    // Unique project ID (used for realm in basic auth)
    projectId: 'ueno',
    // Enable offline support via service worker
    serviceWorker: true,
    // Enable Facebook tracking
    facebookPixel: null,
    // Enable Twitter tracking
    twitterPixel: null,
    // Enable loading resources from Google Fonts
    googleFonts: true,
    // Add to default Content Security Policy
    csp: {},
    // @TODO Show OS notifications
    notifier: 'warn',
  },
  /**
   * Config values available to the server and the client. Store values here that are permissable
   * to be revealed to the client.
   * @type Object
   */
  publicRuntimeConfig: {
    // Pass Helmet attributes to HTML
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
    // @TODO Enable Heroku dev tools
    remoteDevtools: toBoolean(process.env.REMOTE_DEVTOOLS),
    // Enable Google Analytics tracking
    gaId: '',
    // Base URL for server requests
    baseUrl: process.env.BASE_URL || defaultBaseUrl(),
  },
};
