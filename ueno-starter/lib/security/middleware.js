const uuid = require('uuid');
const hpp = require('hpp');
const helmet = require('helmet');
const compact = require('lodash/compact');

/**
 * Create a Content Security Policy config for Helmet, based on how the user's app is configured.
 * @param {Object} config - App config.
 * @returns {Object} CSP config.
 */
const createCsp = (config) => {
  const defaults = {
    directives: {
      childSrc: ["'self'"],
      // Note: Setting this to stricter than * breaks the service worker. :(
      // I can't figure out how to get around this, so if you know of a safer
      // implementation that is kinder to service workers please let me know.
      connectSrc: [
        '*',
        'ws:',
      ],
      defaultSrc: ["'self'"],
      imgSrc: compact([
        // Allow our own hosted and inline images to be loaded
        "'self' 'unsafe-inline'",
        'data:',

        // Allow analytics tracking pixels to be loaded
        config.gaId && '*.google-analytics.com',
        config.facebookPixel && '*.facebook.com',
        config.twitterPixel && 't.co',
      ]),
      fontSrc: compact([
        // Allow self-hosted fonts to be loaded
        "'self'",
        'data:',
      ]),
      objectSrc: ["'self'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
      scriptSrc: compact([
        // Allow scripts hosted from our application
        "'self'",

        // Allow scripts labeled with a nonce
        (req, res) => `'nonce-${res.locals.nonce}'`,

        // Allow polyfills to be loaded
        config.polyfillIO && 'cdn.polyfill.io',

        // Allow service worker scripts from Google's CDN to be loaded
        config.serviceWorker && 'storage.googleapis.com',

        // Allow analytics scripts to be loaded
        config.gaID && '*.google-analytics.com',
        config.facebookPixel && 'connect.facebook.net',
        config.twitterPixel && 'static.ads-twitter.com',
        config.twitterPixel && 'analytics.twitter.com',
      ]),
      styleSrc: [
        "'self'",

        // Webpack generates JS that loads our CSS, so this is needed:
        "'unsafe-inline'",
        'blob:',
      ],
    },
  };

  // Add user-configured CSP directives
  Object.entries(config.csp).forEach(([key, value]) => {
    if (key in defaults.directives) {
      defaults.directives[key].push(...value);
    } else {
      defaults.directives[key] = value;
    }
  });

  return defaults;
};

// Attach a unique "nonce" to every response.  This allows use to declare
// inline scripts as being safe for execution against our content security policy.
// @see https://helmetjs.github.io/docs/csp/
function nonceMiddleware(req, res, next) {
  res.locals.nonce = uuid.v4();
  next();
}

module.exports = config => [
  nonceMiddleware,

  // Prevent HTTP Parameter pollution.
  // @see http://bit.ly/2f8q7Td
  hpp(),

  // The xssFilter middleware sets the X-XSS-Protection header to prevent
  // reflected XSS attacks.
  // @see https://helmetjs.github.io/docs/xss-filter/
  helmet.xssFilter(),

  // Frameguard mitigates clickjacking attacks by setting the X-Frame-Options header.
  // @see https://helmetjs.github.io/docs/frameguard/
  helmet.frameguard('deny'),

  // Sets the X-Download-Options to prevent Internet Explorer from executing
  // downloads in your site’s context.
  // @see https://helmetjs.github.io/docs/ienoopen/
  helmet.ieNoOpen(),

  // Don’t Sniff Mimetype middleware, noSniff, helps prevent browsers from trying
  // to guess (“sniff”) the MIME type, which can have security implications. It
  // does this by setting the X-Content-Type-Options header to nosniff.
  // @see https://helmetjs.github.io/docs/dont-sniff-mimetype/
  helmet.noSniff(),

  // Content Security Policy
  //
  // If you are unfamiliar with CSPs then I highly recommend that you do some
  // reading on the subject:
  //  - https://content-security-policy.com/
  //  - https://developers.google.com/web/fundamentals/security/csp/
  //  - https://developer.mozilla.org/en/docs/Web/Security/CSP
  //  - https://helmetjs.github.io/docs/csp/
  //
  // If you are relying on scripts/styles/assets from other servers (internal
  // or external to your company) then you will need to explicitly configure
  // the CSP below to allow for this.  For example you can see I have had to
  // add the polyfill.io CDN in order to allow us to use the polyfill script.
  // It can be a pain to manage these, but it's a really great habit to get
  // in to.
  //
  // You may find CSPs annoying at first, but it is a great habit to build.
  // The CSP configuration is an optional item for helmet, however you should
  // not remove it without making a serious consideration that you do not
  // require the added security.
  helmet.contentSecurityPolicy(createCsp(config)),
];
