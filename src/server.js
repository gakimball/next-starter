const express = require('express');
const next = require('next');
const compression = require('compression');
const forceHttps = require('express-force-https');
const basicAuth = require('express-basic-auth');
const url = require('url');
const { default: getConfig } = require('next/config');
const security = require('./lib/security/middleware');
const serviceWorker = require('./lib/service-worker');
const hostEnv = require('./lib/host-env');
const serverErrorHandler = require('./lib/server-error-handler');
const appConfig = require('./lib/config/app');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, conf: appConfig() });
const { serverRuntimeConfig: config, publicRuntimeConfig: publicConfig } = getConfig();

/**
 * Create an Express server with security middleware that serves your React app. The server can
 * be customized with extra middleware and routes by passing a callback to the function with
 * one argument, which is the server.
 * @param {Function} [decorate] - Function to modify the server. Takes one parameter, the Express
 * server. Does not need to return a value.
 * @returns {Promise.<Object>} Promise containing the server instance. The Promise resolves once
 * the app has been initialized and the server is listening for requests.
 */
module.exports = (decorate = e => e) => app.prepare().then(() => {
  const server = express();

  // Don't expose any software information to potential hackers.
  server.disable('x-powered-by');

  // Security middlewares.
  server.use(...security(config));

  // Gzip compress the responses.
  if (!app.dev) {
    server.use(compression());
  }

  // Enforce HTTPS (turned off by default)
  if (!app.dev && config.enforceHttps) {
    server.use(forceHttps);
  }

  // Require a username and password to see anything (turned off by default)
  if (process.env.PASSWORD_PROTECT) {
    // This config value can have the format `user:pass`, or `pass`
    const [user, password] = process.env.PASSWORD_PROTECT.split(':');
    const passwordOnly = password === undefined;

    server.use(basicAuth({
      users: {
        [passwordOnly ? '' : user]: passwordOnly ? user : password,
      },
      challenge: true,
      realm: 'ueno',
    }));
  }

  // Allow the service worker initialization script to be served
  if (!app.dev && config.serviceWorker) {
    server.use(serviceWorker(app));
  }

  // This is where we allow the user to customize the server.
  // It comes after all the essential middleware is setup, and before the `*` route that
  // catches every unhandled request.
  decorate(server);

  if (config.routes) {
    const handle = config.routes.getRequestHandler(app);

    server.use(handle);
  } else {
    const handle = app.getRequestHandler();

    // All non-API requests go to Next.js
    server.get('*', (req, res) => {
      const parsedUrl = url.parse(req.url, true);

      handle(req, res, parsedUrl);
    });
  }

  server.listen(hostEnv.PORT, (err) => {
    if (err) {
      throw err;
    }

    console.log(`> Ready on ${publicConfig.baseUrl}`); // eslint-disable-line no-console

    if (process.env.REMOTE_URL) {
      console.log(`> Ready remotely on ${process.env.REMOTE_URL}`); // eslint-disable-line no-console
    }
  });

  return server;
}).catch(serverErrorHandler);
